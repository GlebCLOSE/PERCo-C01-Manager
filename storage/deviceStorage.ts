import * as SecureStore from 'expo-secure-store';
import { Device } from '../types/device';

/**
 * Сохраняет устройство в SecureStore
 * @param name — имя устройства
 * @param ip — IP‑адрес
 * @param password — пароль (опционально, по умолчанию null)
 * @returns Promise<boolean> — true при успехе
 */

export const saveDevice = async (
  name: string,
  ip: string,
  password: string | null = null
): Promise<{ success: boolean; message?: string }> => {
  try {
    // 1. Загружаем текущий список
    const currentDevices = await getDevices();

        // 2. Проверяем уникальность имени
    const existingByName = currentDevices.find(device => device.name === name);
    if (existingByName) {
      return {
        success: false,
        message: `Устройство с именем "${name}" уже существует`
      };
    }

    // 3. Проверяем уникальность IP
    const existingByIp = currentDevices.find(device => device.ip === ip);
    if (existingByIp) {
      return {
        success: false,
        message: `Устройство с IP ${ip} уже существует`
      };
    }

    // 4. Создаём новое устройство
    const newDevice: Device = {
      id: Date.now().toString(),
      name,
      ip,
      password: password ?? null,
      createdAt: new Date().toISOString()
    };

    // 4. Добавляем в список
    const updatedDevices = [...currentDevices, newDevice];

    // 5. Сохраняем весь массив в один ключ
    await SecureStore.setItemAsync('saved_devices', JSON.stringify(updatedDevices));

    return { success: true };
  } catch (error) {
    console.error('Ошибка сохранения устройства:', error);
    return { success: false, message: 'Внутренняя ошибка' };
  }
};

/**
 * Получает список всех сохранённых устройств
 * @returns Promise<Device[]> — массив устройств (пустой при ошибке)
 */

export const getDevices = async (): Promise<Device[]> => {
  try {
    // Получаем всю строку с массивом устройств
    const devicesString = await SecureStore.getItemAsync('saved_devices');
    
    if (!devicesString) {
      return []; // Если данных нет — возвращаем пустой массив
    }

    // Парсим и возвращаем
    const devices = JSON.parse(devicesString) as Device[];
    
    // Сортируем по дате (новые сверху)
    return devices.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Ошибка загрузки устройств:', error);
    return [];
  }
};


interface RemoveCriteria {
  ip?: string;
  name?: string;
}

export const removeDevice = async (criteria: RemoveCriteria): Promise<{ success: boolean; message?: string }> => {
  try {
    const currentDevices = await getDevices();
    let found = false;
    
    const updatedDevices = currentDevices.filter(device => {
      if (criteria.ip && device.ip === criteria.ip) {
        found = true;
        return false; // исключаем из массива
      }
      if (criteria.name && device.name === criteria.name) {
        found = true;
        return false;
      }
      return true; // оставляем остальные
    });
    
    if (!found) {
      return {
        success: false,
        message: 'Устройство не найдено по заданным критериям'
      };
    }
    
    await SecureStore.setItemAsync('saved_devices', JSON.stringify(updatedDevices));
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления устройства:', error);
    return { success: false, message: 'Внутренняя ошибка' };
  }
};