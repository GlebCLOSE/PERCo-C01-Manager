import { useController } from '../providers/ControllerContext';

// Типы для параметров команд
type DeviceNumber = 0 | 1; // Номер ИУ (исполнительного устройства)
type Direction = 0 | 1;    // Направление ИУ
type AccessMode = 'open' | 'control'; // Режим контроля доступа
type ExdevAction = 'open' | 'close'; // Действие над ИУ
type openType = 'open once' | 'open oncealways' | 'open once remove card' | 'open always'


export const useControllerCommands = () => {
  const { socket, isConnected } = useController();

  // Вспомогательная функция для отправки JSON-команд управления
  const sendControlCommand = (controlType: string, payload: object) => {
    if (isConnected && socket) {
      const commandPayload = {
        "control": controlType,
        [controlType]: payload
      };
      socket.send(JSON.stringify(commandPayload));
    } else {
      console.error("Попытка отправить команду без подключения");
    }
  };

  /**
   * 4.1. Установить РКД (Режим Контроля Доступа)
   * Установка: сервер → контроллер: {"control": "acm", "acm": {...}}
   */
  const setAccessMode = (
    mode: AccessMode, 
    deviceNumber: DeviceNumber = 0, 
    direction: Direction = 0
  ) => {
    sendControlCommand('acm', {
      number: deviceNumber,
      direction: direction,
      access_mode: mode,
    });
  };

  /**
   * 4.2. Открыть/Закрыть ИУ
   * Установка: сервер → контроллер: {"control": "exdev", "exdev": {...}}
   */
  const toggleExdevAction = (
    action: ExdevAction, 
    deviceNumber: DeviceNumber = 0, 
    direction: Direction = 0,
    openTimeMs: number = 1000,
    type: openType // Время разблокировки по умолчанию
  ) => {
    sendControlCommand('exdev', {
      number: deviceNumber,
      direction: direction,
      action: action,
      open_time: openTimeMs,
      open_type: type
    });
  };

  /* 4.3. Команда запрета прохода
   * Установка: сервер → контроллер: {"control": "exdev", "exdev": {...}}
   */
  const declineAccessAction = (
    deviceNumber: DeviceNumber = 0,
    direction: Direction = 0
  ) => {
    sendControlCommand('access', {
      number: deviceNumber,
      direction: direction
    })
  }


  /**
   * 3. Запрос слова состояния
   * Запрос: сервер → контроллер: {"get": "state"}
   * Ответ придет в WebSocket.onmessage в контексте
   */
  const requestDeviceState = () => {
    if (isConnected && socket) {
        socket.send(JSON.stringify({ "get": "state" }));
    }
  };


  // Возвращаем набор методов для использования в компонентах
  return {
    setAccessMode,
    toggleExdevAction,
    requestDeviceState,
    declineAccessAction,
    isConnected 
  };
};