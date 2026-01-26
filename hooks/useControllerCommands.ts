import { useController } from '../providers/ControllerContext';

// Типы для параметров команд
type DeviceNumber = 0 | 1; // Номер ИУ (исполнительного устройства)
type Direction = 0 | 1;    // Направление ИУ
type AccessMode = 'open' | 'control'; // Режим контроля доступа
type ExdevAction = 'open' | 'close'; // Действие над ИУ
type openType = 'open once' | 'open oncealways' | 'open once remove card' | 'open always'

interface NetworkC01Params {
  ip?: string,
  mask?: string,
  gateway?: string,
  server?: string,
  password?: string
}


export const useControllerCommands = () => {
  const { socket, isConnected } = useController();

  // Отравка команду на установку настроект
const sendSetCommand = async (setType: string, payload: object) => {
  // 1. Проверка подключения

  if (!isConnected || !socket || socket.readyState !== WebSocket.OPEN) {
    throw new Error("Нет подключения к контроллеру");
  }

  const commandPayload = {
    "set": setType,
    [setType]: payload
  };

  // 2. Возвращаем Promise, который разрешится при получении ответа
  return new Promise((resolve, reject) => {
    // Тайм-аут: если контроллер не ответит за 5 секунд
    const timeout = setTimeout(() => {
      socket.removeEventListener('message', handleResponse);
      reject(new Error(`Превышено время ожидания ответа для: ${setType}`));
    }, 5000);

    // Функция-обработчик входящих сообщений
    const handleResponse = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Проверяем, есть ли в ответе подтверждение для нашей команды
          if (data.answer && data.answer[setType]) {
            clearTimeout(timeout); // Отменяем тайм-аут
            socket.removeEventListener('message', handleResponse); // Удаляем слушателя

            if (data.answer[setType] === "ok") {
              console.log(`Команда ${setType} выполнена успешно`);
              resolve(data); // Возвращаем полные данные ответа (включая обновленные параметры)
            } else {
              reject(new Error(`Контроллер вернул ошибку для ${setType}: ${data.answer[setType]}`));
            }
          }
        } catch (err) {
          console.error("Ошибка парсинга JSON:", err);
        }
      };

      // Подписываемся на сообщения
      socket.addEventListener('message', handleResponse);

      // Отправляем команду
      socket.send(JSON.stringify(commandPayload));
    });
  };

  // Функция получения данных с контроллера
  const getDataFromController = async (getType: string, payload: object) => {

    if (!isConnected || !socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error("Нет подключения к контроллеру");
    }

    let commandPayload = {
      "get": getType,
      [getType]: payload
    };

    if(getType==='state'){
      commandPayload = {'get': 'state'}
    }

    return new Promise((resolve, reject) => {

      // Таймаут подключения 
      const timeout = setTimeout(() => {
        socket.removeEventListener('message', handleResponse);
        reject(new Error(`Превышено время ожидания ответа для: ${setType}`));
      }, 5000);

      const handleResponse = (event) => {
        try {
          const data = JSON.parse(event.data)

          if(data.answer && data.answer[getType]){

            clearTimeout(timeout); // Отменяем тайм-аут
            socket.removeEventListener('message', handleResponse); // Удаляем слушателя

            if(data.answer[getType]==='ok'){
              console.log('Данные состояния получены')
              resolve(data)
            }
            else {
              reject(new Error(`Контроллер вернул ошибку для ${getType}: ${data.answer[getType]}`));
            }
          }
        } catch (err) {
          console.error("Ошибка парсинга JSON:", err);
        }

      }


      // Подписываемся на сообщения
      socket.addEventListener('message', handleResponse);

      // Отправляем команду
      socket.send(JSON.stringify(commandPayload));

    });

  }


  //Получаем данные о состоянии контроллера
  const getState = async () => {
    return await getDataFromController('state', {})
  }

  // Получаем данные о ИУ
  const getExdevInfo = async (number: number) => {
    return await getDataFromController('exdev', {'number': number})
  }

    //Функция отправки сетевых настроек на контроллер
  const setNetworkSettings = async (netParams: NetworkC01Params) => {
    // Создаем объект только из тех полей, которые были переданы (не undefined)
    const payload: NetworkC01Params = {};
    
    if (netParams.ip !== undefined) payload.ip = netParams.ip;
    if (netParams.mask !== undefined) payload.mask = netParams.mask;
    if (netParams.gateway !== undefined) payload.gateway = netParams.gateway;
    if (netParams.server !== undefined) payload.server = netParams.server;
    if (netParams.password !== undefined) payload.password = netParams.password;

    // Если объект пустой, можно либо прервать выполнение, либо отправить как есть
    if (Object.keys(payload).length === 0) {
      console.warn("Нет данных для обновления");
      return;
    }

    return await sendSetCommand('net', payload);
  };

  const setDefaultNetwork = async () => await sendSetCommand('net', {})





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
    getState,
    getExdevInfo,
    setNetworkSettings, 
    setDefaultNetwork,
    setAccessMode,
    toggleExdevAction,
    requestDeviceState,
    declineAccessAction,
    isConnected 
  };
};