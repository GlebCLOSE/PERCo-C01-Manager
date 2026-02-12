import { useController } from '../providers/ControllerContext';

export interface NetworkParams {
  ip?: string,
  mask?: string,
  gateway?: string,
  server?: string,
  password?: string
}

export interface ReaderParams {
    "number"?: 0 | 1,
    "type"?: "Wiegand" | "Barcode" | "Barcode_terminator" | "Barcode-USB_terminator" | "Barcode-USB",
    "port"?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    "exdev_number"?: 0 | 1,
    "exdev_direction"?: 0 | 1
}

export interface ExdevParams {

    "number"?: 0,
    "type"?: "lock" | "double lock" | "turnstyle" | "gate",
    "opt_fix"?: "card" | "pass",
    "analysis_time"?: number,
    "unblock_time"?: number,
    "opt_mode"?: "potencial" | "pulse",
    "opt_norm"?: "afterclosed" | "afteropened",
    "impulse_time"?: number,
    "remove_card_time"?: number,
    "wait_command_time"?: number

}

export interface PadParams {
    "number"?: 0 | 1,
    "function"?: "input" | "remote control input" | "pass" | "fire alarm input" | "remove card input" | 'output' | 'exdev output' | 'remote card output' | 'fire alarm output' | 'remove card output',
    "resource"?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    "resource_direction"?: 0 | 1 | 2 | 3,
    "normal_state"?: 'short' | 'break' | 'not powered' | 'powered',
    "debounce"?: number
}

export interface CrossParams {
    "number"?: number,  //От 0 до 999
    "source"?: "activating input" | "unlocking exdev" | "opening exdev" | "get card" | "command" | "breaking exdev" | "long time opening exdev" |  "cover on" | "activating fire alarm input" | "normalizing fire alarm input"
    "source_number"?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    "source_direction"?: 0 | 1,
    "destination"?: "activated output" | "mask input" | "normalized output",
    "destination_number"?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    "destination_direction"?: 0 | 1,
    "time_criteria"?: "work time" | "absolute time" | "after work time",
    "time_reaction"?: 0 // От 0 до 1000000 миллисекунд
}

type GetType = 'reader' | 'exdev' | 'pad' | 'cross';

export const useControllerConfig = () => {
    const { socket, isConnected } = useController();

    // Команда на установку конфигурационных параметров(Set)
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
            } else {
                // Это пинг или другое событие. Просто логируем и пропускаем.
                console.log("Получено стороннее событие или пинг, продолжаем ждать...");
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

    //---------------------------------------------------------------------------------------------------------------

    const getDataFromController = async (getType: string, payload: object, collectAll = false) => {
        if (!isConnected || !socket || socket.readyState !== WebSocket.OPEN) {
            throw new Error("Нет подключения к контроллеру");
        }

        let commandPayload = (getType === 'state') ? { 'get': 'state' } : { "get": getType, [getType]: payload };

        return new Promise((resolve, reject) => {
            const results: any[] = [];
            let totalTimeout: NodeJS.Timeout;
            let silenceTimeout: NodeJS.Timeout;

            const cleanup = () => {
                clearTimeout(totalTimeout);
                clearTimeout(silenceTimeout);
                socket.removeEventListener('message', handleResponse);
            };

        const handleResponse = (event) => {
            try {
                const rawData = event.data;
                
                // Разделяем склеенные JSON-объекты. 
                // Ищем границу между } и { и вставляем разделитель
                const jsonStrings = rawData
                    .replace(/}\s*{/g, '}|--|{')
                    .split('|--|');

                jsonStrings.forEach(str => {
                    const data = JSON.parse(str); // Теперь парсим каждый объект отдельно

                    if (data.answer && data.answer[getType] === 'ok') {
                        if (!collectAll) {
                            cleanup();
                            resolve(data);
                        } else {
                            results.push(data);
                            
                            // Сбрасываем таймаут тишины
                            clearTimeout(silenceTimeout);
                            silenceTimeout = setTimeout(() => {
                                cleanup();
                                resolve(results);
                            }, 500);
                        }
                    }
                });
            } catch (err) {
                console.error("Критическая ошибка парсинга:", err, "Raw data:", event.data);
            }
        };

            // Общий таймаут (если контроллер вообще не ответил)
            totalTimeout = setTimeout(() => {
                cleanup();
                if (collectAll && results.length > 0) {
                    resolve(results); // Если хоть что-то успели собрать
                } else {
                    reject(new Error(`Превышено время ожидания ответа для: ${getType}`));
                }
            }, 5000);

            socket.addEventListener('message', handleResponse);
            socket.send(JSON.stringify(commandPayload));
        });
    };

    //----------------------------------------------------------------------------------------------------------------


    //Получаем данные о состоянии контроллера
    const getState = async () => {
        return await getDataFromController('state', {})
    }



    //Получаем данные о считывателях, ИУ, физ. контактах, внутр. реакциях
    const getInfo = async (type: GetType, number: 'all' | number) => {
        const isAll = number === 'all';
        const params = isAll ? {} : { "number": number };
        
        // Передаем true в третий аргумент, если запрашиваем 'all'
        return await getDataFromController(type, params, isAll);
    };


        //Функция отправки сетевых настроек на контроллер
    const setNetworkSettings = async (netParams: NetworkParams) => {
        // Создаем объект только из тех полей, которые были переданы (не undefined)
        const payload: NetworkParams = {};
        
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

    const setExdevConfig = async (exdevParams: Partial<ExdevParams>) => {
    
        const payload = Object.fromEntries(
            Object.entries(exdevParams).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(payload).length === 0) {
            console.warn("Нет данных для обновления");
            return;
        }

        return await sendSetCommand('exdev', payload);
    };


    // Установка заводских сетевых настроек
    const setDefaultNetwork = async () => await sendSetCommand('net', {})



    // TODO: Функции установки конфигурационных параметров: setExdevConfig, setPadConfig, setReaderConfig, setCrossConfig


    return {
        setDefaultNetwork,
        setNetworkSettings,
        setExdevConfig,
        getInfo,
        getState,

    }

}