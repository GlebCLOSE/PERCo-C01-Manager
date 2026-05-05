import React, { createContext, useState, useContext, useEffect, ReactNode, useRef, useCallback } from 'react';
import { parseIncomingFrames } from '../utils/controller/parseIncoming';
import type { PercoEvent } from '../types/events';
import { RequestManager, type MessageMatcher } from '../utils/controller/requestManager';
import { clearEventsDb, getRecentEventsFromDb, initEventsDb, insertEventToDb } from '../utils/controller/eventsDb';
import { attemptConnection } from '../utils/attemptConnection';
import { getDevices } from '../storage/deviceStorage';

export type ReconnectResult =
  | { ok: true }
  | { ok: false; message: string; needManualConnect?: boolean };

// Описываем интерфейс состояния контекста
interface ControllerContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  ipAddress: string | null;
  configRevision: number;
  touchConfig: () => void;
  setGlobalSocket: (ws: WebSocket, sessionPassword?: string | null) => void;
  reconnectToController: () => Promise<ReconnectResult>;
  disconnect: () => void;
  events: Array<{ event: PercoEvent; receivedAt: number }>;
  clearEvents: () => void;
  sendAndWaitFor<T>(payload: unknown, match: MessageMatcher<T>, timeoutMs?: number): Promise<T>;
  sendAndCollect<T>(
    payload: unknown,
    match: MessageMatcher<T>,
    opts?: { totalTimeoutMs?: number; silenceMs?: number }
  ): Promise<T[]>;
}

// Создаем контекст с начальным значением null
const ControllerContext = createContext<ControllerContextType | undefined>(undefined);

/** Период опроса контроллера: при отключении питания TCP может долго оставаться «живым». */
const CONNECTION_PROBE_INTERVAL_MS = 10_000;
/** Если ответ на лёгкий get state не пришёл — считаем связь потерянной. */
const CONNECTION_PROBE_TIMEOUT_MS = 4_000;

interface Props {
  children: ReactNode;
}

export const ControllerProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [configRevision, setConfigRevision] = useState<number>(0);
  const [events, setEvents] = useState<Array<{ event: PercoEvent; receivedAt: number }>>([]);
  const requestManagerRef = useRef(new RequestManager());
  const recentEventKeysRef = useRef<Map<string, number>>(new Map());
  const sessionPasswordRef = useRef<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const connectionProbeInFlightRef = useRef(false);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initEventsDb();
        const loaded = await getRecentEventsFromDb(500);
        if (!cancelled && loaded.length) setEvents(loaded);
      } catch (e) {
        console.error('Failed to init events DB', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const disconnect = useCallback(() => {
    sessionPasswordRef.current = null;
    if (socket) {
      socket.close();
    }
    setSocket(null);
    setIsConnected(false);
    requestManagerRef.current.reset();
  }, [socket]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    void clearEventsDb().catch((e) => console.error('Failed to clear events DB', e));
  }, []);

  const sendAndWaitFor = useCallback(
    async <T,>(payload: unknown, match: MessageMatcher<T>, timeoutMs = 5000): Promise<T> => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error('Нет подключения к контроллеру');
      }
      const p = requestManagerRef.current.waitForOne(match, timeoutMs);
      socket.send(JSON.stringify(payload));
      return await p;
    },
    [socket]
  );

  const sendAndCollect = useCallback(
    async <T,>(
      payload: unknown,
      match: MessageMatcher<T>,
      opts?: { totalTimeoutMs?: number; silenceMs?: number }
    ): Promise<T[]> => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error('Нет подключения к контроллеру');
      }
      const p = requestManagerRef.current.collect(match, opts);
      socket.send(JSON.stringify(payload));
      return await p;
    },
    [socket]
  );

  /** Обнаружение «тихой» потери связи (нет RST/FIN, например снятие питания с контроллера). */
  useEffect(() => {
    if (!isConnected || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const stateAnswerMatcher = (msg: unknown): msg is { answer: { state: unknown } } =>
      Boolean(
        msg &&
          typeof msg === 'object' &&
          'answer' in msg &&
          typeof (msg as { answer?: unknown }).answer === 'object' &&
          (msg as { answer: { state?: unknown } }).answer &&
          'state' in (msg as { answer: { state?: unknown } }).answer
      );

    const runProbe = async () => {
      if (connectionProbeInFlightRef.current) return;
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      connectionProbeInFlightRef.current = true;
      try {
        await sendAndWaitFor({ get: 'state' }, stateAnswerMatcher, CONNECTION_PROBE_TIMEOUT_MS);
      } catch {
        console.warn('PERCo-C01: connection probe failed, treating as disconnected');
        try {
          ws.close();
        } catch {
          /* ignore */
        }
        requestManagerRef.current.reset();
        setIsConnected(false);
        setSocket(null);
      } finally {
        connectionProbeInFlightRef.current = false;
      }
    };

    const intervalId = setInterval(() => {
      void runProbe();
    }, CONNECTION_PROBE_INTERVAL_MS);

    const kickoffId = setTimeout(() => {
      void runProbe();
    }, 5_000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(kickoffId);
    };
  }, [isConnected, socket, sendAndWaitFor]);

  const setGlobalSocket = useCallback((ws: WebSocket, sessionPassword?: string | null) => {
    if (typeof sessionPassword === 'string') {
      sessionPasswordRef.current = sessionPassword;
    }

    try {
      const host = new URL(ws.url).hostname;
      setIpAddress(host);
    } catch (e) {
      console.error("Invalid WS URL", e);
    }
    // Типизируем обработчики событий сокета
    ws.onclose = () => {
      requestManagerRef.current.reset();
      setIsConnected(false);
      setSocket(null);
      console.log('PERCo-C01: Connection closed');
    };

    ws.onerror = (e: Event) => {
      console.error('PERCo-C01: Socket error', e);
      requestManagerRef.current.reset();
      setIsConnected(false);
    };

    ws.onmessage = (e: MessageEvent) => {
      const frames = parseIncomingFrames(e.data);
      for (const msg of frames) {
        requestManagerRef.current.handleMessage(msg);

        if (msg && typeof msg === 'object' && typeof msg.event === 'string') {
          // События контроллера (PercoEvent). Runtime-валидация минимальная; типизация обеспечивается источником.
          const receivedAt = Date.now();
          const key = (() => {
            try {
              return JSON.stringify(msg);
            } catch {
              return String(msg?.event ?? 'event');
            }
          })();

          const lastAt = recentEventKeysRef.current.get(key);
          // Дедупликация одинаковых событий в пределах 1 секунды
          if (typeof lastAt === 'number' && receivedAt - lastAt < 1000) {
            continue;
          }
          recentEventKeysRef.current.set(key, receivedAt);
          // ограничим размер map
          if (recentEventKeysRef.current.size > 1000) {
            const entries = [...recentEventKeysRef.current.entries()].sort((a, b) => a[1] - b[1]);
            for (let i = 0; i < entries.length - 500; i++) {
              recentEventKeysRef.current.delete(entries[i][0]);
            }
          }

          setEvents((prev) => {
            const next = [...prev, { event: msg as PercoEvent, receivedAt }];
            // ограничим рост памяти
            if (next.length > 500) return next.slice(next.length - 500);
            return next;
          });

          void insertEventToDb(msg as PercoEvent, receivedAt).catch((err) =>
            console.error('Failed to persist event', err)
          );
        }
      }
    };

    setSocket(ws);
    setIsConnected(true);
  }, []);

  const reconnectToController = useCallback(async (): Promise<ReconnectResult> => {
    const ip = ipAddress;
    if (!ip) {
      return { ok: false, message: 'IP контроллера неизвестен', needManualConnect: true };
    }
    let pwd = sessionPasswordRef.current;
    if (!pwd) {
      try {
        const devices = await getDevices();
        const match = devices.find((d) => d.ip === ip);
        pwd = match?.password ?? null;
      } catch (e) {
        console.error('Failed to read saved devices', e);
      }
    }
    if (!pwd) {
      return {
        ok: false,
        message: 'Нет сохранённого пароля для переподключения.',
        needManualConnect: true,
      };
    }

    try {
      const connectionResult = (await attemptConnection(ip, pwd)) as {
        success: boolean;
        socket?: WebSocket;
        message?: string;
      };
      if (connectionResult.success && connectionResult.socket) {
        setGlobalSocket(connectionResult.socket, pwd);
        return { ok: true };
      }
      return {
        ok: false,
        message: connectionResult.message ?? 'Не удалось переподключиться к контроллеру',
      };
    } catch {
      return { ok: false, message: 'Произошла ошибка при переподключении' };
    }
  }, [ipAddress, setGlobalSocket]);

  const touchConfig = () => setConfigRevision((v) => v + 1);

  const value = {
    socket,
    isConnected,
    ipAddress,
    configRevision,
    touchConfig,
    setGlobalSocket,
    reconnectToController,
    disconnect,
    events,
    clearEvents,
    sendAndWaitFor,
    sendAndCollect,
  };

  return (
    <ControllerContext.Provider value={value}>
      {children}
    </ControllerContext.Provider>
  );
};

// Типизированный хук с проверкой на наличие провайдера
export const useController = (): ControllerContextType => {
  const context = useContext(ControllerContext);
  if (context === undefined) {
    throw new Error('useController must be used within a ControllerProvider');
  }
  return context;
};