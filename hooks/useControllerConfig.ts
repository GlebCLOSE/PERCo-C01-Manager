import { useCallback } from 'react';
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
    "number"?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15,
    "function"?: "input" | "remote control input" | "pass" | "fire alarm input" | "remove card input" | 'output' | 'exdev output' | 'remote card output' | 'fire alarm output' | 'remove card output',
    "resource_number"?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    "resource_direction"?: 0 | 1 | 2 | 3,
    "normal_state"?: 'short' | 'break' | 'not powered' | 'powered',
    "debounce"?: number,
    "state"?: 0 | 1  
}

export interface CrossParams {
    "number"?: number,
    "source"?: "activating input" | "unlocking exdev" | "opening exdev" | "get card" | "command" | "breaking exdev" | "long time opening exdev" | "cover on" | "activating fire alarm input" | "normalizing fire alarm input",
    "source_number"?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    "source_direction"?: 0 | 1,
    "destination"?: "mask input" | "activated output" | "normalized output",
    "destination_number"?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    "destination_direction"?: 0 | 1,
    "time_criteria"?: "work time" | "absolute time" | "after work time",
    "time_reaction"?: number
}

type GetType = 'reader' | 'exdev' | 'pad' | 'cref';

export const useControllerConfig = () => {
    const { isConnected, touchConfig, sendAndWaitFor, sendAndCollect } = useController();

    // Команда на установку конфигурационных параметров(Set)
    const sendSetCommand = useCallback(async (setType: string, payload: object) => {

        // 1. Проверка подключения

        if (!isConnected) {
            throw new Error("Нет подключения к контроллеру");
        }

        const commandPayload = {
            "set": setType,
            [setType]: payload
        };

        const data = await sendAndWaitFor<any>(
            commandPayload,
            (msg: any): msg is any => Boolean(msg?.answer && msg.answer[setType]),
            5000
        );

        if (data.answer?.[setType] === "ok") {
            console.log(`Команда ${setType} выполнена успешно`);
            touchConfig();
            return data;
        }
        throw new Error(`Контроллер вернул ошибку для ${setType}: ${data.answer?.[setType]}`);
    }, [isConnected, sendAndWaitFor, touchConfig]);

    //---------------------------------------------------------------------------------------------------------------

    const getDataFromController = useCallback(async (getType: string, payload: object, collectAll = false) => {
        if (!isConnected) {
            throw new Error("Нет подключения к контроллеру");
        }

        let commandPayload: Record<string, unknown>;
        if (getType === 'state') {
            commandPayload = { get: 'state' };
        } else if (getType === 'cref') {
            const n = (payload as { number?: number }).number;
            if (!collectAll && typeof n === 'number') {
                commandPayload = { get: 'cref', number: n };
            } else {
                commandPayload = { get: 'cref', cref: payload };
            }
        } else {
            commandPayload = { get: getType, [getType]: payload };
        }

        if (!collectAll) {
            const data = await sendAndWaitFor<any>(
                commandPayload,
                (msg: any): msg is any => Boolean(msg?.answer && msg.answer[getType]),
                5000
            );
            if (data.answer?.[getType] === 'ok') return data;
            throw new Error(`Контроллер вернул ошибку для ${getType}: ${data.answer?.[getType]}`);
        }

        const results = await sendAndCollect<any>(
            commandPayload,
            (msg: any): msg is any => Boolean(msg?.answer && msg.answer[getType] === 'ok'),
            { totalTimeoutMs: 5000, silenceMs: 500 }
        );
        return results;
    }, [isConnected, sendAndCollect, sendAndWaitFor]);

    //----------------------------------------------------------------------------------------------------------------


    //Получаем данные о состоянии контроллера
    const getState = useCallback(async () => await getDataFromController('state', {}), [getDataFromController]);



    //Получаем данные о считывателях, ИУ, физ. контактах, внутр. реакциях
    const getInfo = useCallback(async (type: GetType, number: 'all' | number) => {
        const isAll = number === 'all';
        const params = isAll ? {} : { "number": number };
        
        // Передаем true в третий аргумент, если запрашиваем 'all'
        return await getDataFromController(type, params, isAll);
    }, [getDataFromController]);


        //Функция отправки сетевых настроек на контроллер
    const setNetworkSettings = useCallback(async (netParams: NetworkParams) => {
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
    }, [sendSetCommand]);

    const setExdevConfig = useCallback(async (exdevParams: Partial<ExdevParams>) => {
    
        const payload = Object.fromEntries(
            Object.entries(exdevParams).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(payload).length === 0) {
            console.warn("Нет данных для обновления");
            return;
        }

        return await sendSetCommand('exdev', payload);
    }, [sendSetCommand]);

    const setPadConfig = useCallback(async (padParams: Partial<PadParams>) => {

        const payload = Object.fromEntries(
            Object.entries(padParams).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(payload).length === 0) {
            console.warn("Нет данных для обновления");
            return;
        }

        return await sendSetCommand('pad', payload);
    }, [sendSetCommand]);


    // Установка заводских сетевых настроек
    const setDefaultNetwork = useCallback(async () => await sendSetCommand('net', {}), [sendSetCommand]);

    const setReaderConfig = useCallback(async (readerParams: Partial<ReaderParams>) => {
        const payload = Object.fromEntries(
            Object.entries(readerParams).filter(([_, v]) => v !== undefined)
        );
        if (Object.keys(payload).length === 0) {
            console.warn("Нет данных для обновления");
            return;
        }
        return await sendSetCommand('reader', payload);
    }, [sendSetCommand]);

    const setCrossConfig = useCallback(async (crossParams: Partial<CrossParams>) => {
        const payload = Object.fromEntries(
            Object.entries(crossParams).filter(([_, v]) => v !== undefined)
        );
        if (Object.keys(payload).length === 0) {
            console.warn("Нет данных для обновления");
            return;
        }
        return await sendSetCommand('cref', payload);
    }, [sendSetCommand]);

    return {
        setDefaultNetwork,
        setNetworkSettings,
        setExdevConfig,
        setPadConfig,
        setReaderConfig,
        setCrossConfig,
        getInfo,
        getState,

    }

}