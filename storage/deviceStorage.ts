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

    // 2. Проверяем дубликат по IP
    const isDuplicate = currentDevices.some(device => device.ip === ip);
    if (isDuplicate) {
      return { success: false, message: `Устройство с IP ${ip} уже сохранено` };
    }

    // 3. Создаём новое устройство
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


export const removeDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const currentDevices = await getDevices();
    const filteredDevices = currentDevices.filter(device => device.id !== deviceId);
    
    await SecureStore.setItemAsync(
      'saved_devices',
      JSON.stringify(filteredDevices)
    );
    return true;
  } catch (error) {
    console.error('Ошибка удаления устройства:', error);
    return false;
  }
};