import md5 from 'md5';
import { parseIncomingFrames } from './controller/parseIncoming';
import type { WsTransportLogEntry } from '../types/wsTransportLog';

export type AttemptConnectionOptions = {
  onTransportLog?: (entry: WsTransportLogEntry) => void;
};

export const attemptConnection = (ip: string, password: string, opts?: AttemptConnectionOptions) => {
  const log = opts?.onTransportLog;

  return new Promise((resolve) => {
    const wsUrl = `ws://${ip}:80/tcp`;
    let ws: WebSocket | null = null;
    let isResolved = false;

    const timeout = setTimeout(() => {
      if (ws) ws.close();
      resolve({ success: false, message: 'Контроллер не ответил вовремя' });
    }, 7000);

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        clearTimeout(timeout);
        if (!isResolved) {
          isResolved = true;
          if (!ws) return;
          const verifyPayload = { set: 'verify_acl', verify_acl: [{}] };
          log?.({ direction: 'out', ts: Date.now(), body: verifyPayload });
          ws.send(JSON.stringify(verifyPayload));
          resolve({ success: true, socket: ws });
        }
      };

      ws.onmessage = (e) => {
        if (!e.data || typeof e.data !== 'string' || e.data.trim() === '') {
          return;
        }

        try {
          const frames = parseIncomingFrames(e.data);
          frames.forEach((data) => {
            if (!data || typeof data !== 'object') return;

            log?.({ direction: 'in', ts: Date.now(), body: data });

            if (data.event === 'need_auth') {
              const salt = data.need_auth?.salt;
              if (typeof salt !== 'string') return;

              const hash = md5(salt + password);
              const authPayload = {
                set: 'auth',
                auth: { hash },
              };
              log?.({ direction: 'out', ts: Date.now(), body: authPayload });
              ws?.send(JSON.stringify(authPayload));
            }

            if (data.answer && data.answer.auth) {
              clearTimeout(timeout);

              if (data.answer.auth === 'ok') {
                if (!ws) return;
                resolve({ success: true, socket: ws });
              } else {
                ws?.close();
                resolve({ success: false, message: 'Неверный пароль доступа' });
              }
            }
          });
        } catch (err) {
          console.error('Общая ошибка обработки сообщения:', err);
        }
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        resolve({ success: false, message: 'Ошибка сети или порт закрыт' });
      };

      ws.onclose = () => {
        console.log('Соединение с C01 разорвано');
      };
    } catch {
      clearTimeout(timeout);
      resolve({ success: false, message: 'Критическая ошибка при создании сокета' });
    }
  });
};
