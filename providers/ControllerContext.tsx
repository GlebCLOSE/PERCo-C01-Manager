import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Описываем интерфейс состояния контекста
interface ControllerContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  ipAddress: string | null;
  configRevision: number;
  touchConfig: () => void;
  setGlobalSocket: (ws: WebSocket) => void;
  disconnect: () => void;
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
  };

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

    setSocket(ws);
    setIsConnected(true);
  };

  const touchConfig = () => setConfigRevision((v) => v + 1);

  const value = { socket, isConnected, ipAddress, configRevision, touchConfig, setGlobalSocket, disconnect };

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