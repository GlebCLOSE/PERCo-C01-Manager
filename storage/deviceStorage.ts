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

    const existingDevices = await getDevices(); // Загружаем текущий список

    const isDuplicate = existingDevices.some(device => device.ip === ip);

    if (isDuplicate) {
        console.log('Устройство с IP ${ip} уже сохранено')
      return {
        success: false,
        message: `Устройство с IP ${ip} уже сохранено`
      };
    }
    const deviceId = Date.now().toString();

    const device: Device = {
      id: deviceId,
      name,
      ip,
      password: password ?? null,
      createdAt: new Date().toISOString(),
    };

    const deviceString = JSON.stringify(device);
    await SecureStore.setItemAsync(`device_${deviceId}`, deviceString);

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