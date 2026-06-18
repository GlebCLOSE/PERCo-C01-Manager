import md5 from 'md5';
import { parseIncomingFrames } from './controller/parseIncoming';
import type { WsTransportLogEntry } from '../types/wsTransportLog';

export type AttemptConnectionOptions = {
  onTransportLog?: (entry: WsTransportLogEntry) => void;
};

export type AttemptConnectionResult = {
  success: boolean;
  socket?: WebSocket;
  message?: string;
};

const CONNECTION_TIMEOUT_MS = 10_000;
/** Если need_auth не пришёл — считаем, что пароль на контроллере не задан. */
const NO_AUTH_FALLBACK_MS = 2_000;

export const attemptConnection = (
  ip: string,
  password: string,
  opts?: AttemptConnectionOptions
): Promise<AttemptConnectionResult> => {
  const log = opts?.onTransportLog;

  return new Promise((resolve) => {
    const wsUrl = `ws://${ip}:80/tcp`;
    let ws: WebSocket | null = null;
    let settled = false;
    let authRequired = false;
    let noAuthTimer: ReturnType<typeof setTimeout> | null = null;

    const finish = (result: AttemptConnectionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (noAuthTimer) clearTimeout(noAuthTimer);
      resolve(result);
    };

    const timeout = setTimeout(() => {
      ws?.close();
      finish({ success: false, message: 'Контроллер не ответил вовремя' });
    }, CONNECTION_TIMEOUT_MS);

    const sendVerifyAcl = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const verifyPayload = { set: 'verify_acl', verify_acl: [{}] };
      log?.({ direction: 'out', ts: Date.now(), body: verifyPayload });
      ws.send(JSON.stringify(verifyPayload));
    };

    const onAuthenticated = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      sendVerifyAcl();
      finish({ success: true, socket: ws });
    };

    const scheduleNoAuthFallback = () => {
      if (noAuthTimer) clearTimeout(noAuthTimer);
      noAuthTimer = setTimeout(() => {
        if (!authRequired && !settled) {
          onAuthenticated();
        }
      }, NO_AUTH_FALLBACK_MS);
    };

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        scheduleNoAuthFallback();
      };

      ws.onmessage = (e) => {
        if (!e.data || typeof e.data !== 'string' || e.data.trim() === '') {
          return;
        }

        try {
          const frames = parseIncomingFrames(e.data);
          for (const data of frames) {
            if (!data || typeof data !== 'object') continue;

            log?.({ direction: 'in', ts: Date.now(), body: data });

            if (data.event === 'need_auth') {
              authRequired = true;
              if (noAuthTimer) clearTimeout(noAuthTimer);

              const salt = data.need_auth?.salt;
              if (typeof salt !== 'string') continue;

              const hash = md5(salt + password);
              const authPayload = {
                set: 'auth',
                auth: { hash },
              };
              log?.({ direction: 'out', ts: Date.now(), body: authPayload });
              ws?.send(JSON.stringify(authPayload));
              continue;
            }

            if (data.answer && data.answer.auth) {
              if (data.answer.auth === 'ok') {
                onAuthenticated();
              } else {
                ws?.close();
                finish({ success: false, message: 'Неверный пароль доступа' });
              }
            }
          }
        } catch (err) {
          console.error('Общая ошибка обработки сообщения:', err);
        }
      };

      ws.onerror = () => {
        finish({ success: false, message: 'Ошибка сети или порт закрыт' });
      };

      ws.onclose = () => {
        if (!settled) {
          finish({ success: false, message: 'Соединение с контроллером разорвано' });
        } else {
          console.log('Соединение с C01 разорвано');
        }
      };
    } catch {
      finish({ success: false, message: 'Критическая ошибка при создании сокета' });
    }
  });
};
