import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Описываем интерфейс состояния контекста
interface ControllerContextType {
  socket: WebSocket | null;
  isConnected: boolean;
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

  return (
    <ControllerContext.Provider value={{ socket, isConnected, setGlobalSocket, disconnect }}>
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