import React, { createContext, useState, useContext, useEffect, ReactNode, useRef, useCallback } from 'react';
import { parseIncomingFrames } from '../utils/controller/parseIncoming';
import type { PercoEvent } from '../types/events';
import { RequestManager, type MessageMatcher } from '../utils/controller/requestManager';

// Описываем интерфейс состояния контекста
interface ControllerContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  ipAddress: string | null;
  configRevision: number;
  touchConfig: () => void;
  setGlobalSocket: (ws: WebSocket) => void;
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

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
    setSocket(null);
    setIsConnected(false);
    requestManagerRef.current.reset();
  };

  const clearEvents = useCallback(() => setEvents([]), []);

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

  const setGlobalSocket = (ws: WebSocket) => {

    try {
      const host = new URL(ws.url).hostname;
      setIpAddress(host);
    } catch (e) {
      console.error("Invalid WS URL", e);
    }
    // Типизируем обработчики событий сокета
    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
      console.log('PERCo-C01: Connection closed');
    };

    ws.onerror = (e: Event) => {
      console.error('PERCo-C01: Socket error', e);
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
        }
      }
    };

    setSocket(ws);
    setIsConnected(true);
  };

  const touchConfig = () => setConfigRevision((v) => v + 1);

  const value = {
    socket,
    isConnected,
    ipAddress,
    configRevision,
    touchConfig,
    setGlobalSocket,
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