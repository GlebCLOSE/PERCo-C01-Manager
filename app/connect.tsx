import { TextInput, Button, View, Text, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import InputField from '../components/ui/elements/input/InputField';
import ErrorModal from '../components/ui/status/ErrorModal';

export default function ConnectForm() {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [errors, setErrors] = useState({});
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter()

  // Функция валидации IP‑адреса
  const validateIP = (ipAddress) => {
    if (!ipAddress.trim()) {
      return 'IP‑адрес обязателен';
    }

    const parts = ipAddress.trim().split('.');
    if (parts.length !== 4) {
      return 'IP‑адрес должен содержать 4 части, разделённые точками';
    }

    for (const part of parts) {
      if (!/^\d+$/.test(part)) {
        return 'Каждая часть IP‑адреса должна содержать только цифры';
      }
      const num = parseInt(part, 10);
      if (num < 0 || num > 255) {
        return 'Каждая часть IP‑адреса должна быть от 0 до 255';
      }
    }
    return null;
  };

  // Функция валидации имени контроллера
  const validateDeviceName = (name) => {
    if (!name.trim()) {
      return 'Имя контроллера обязательно';
    }
    if (name.length > 20) {
      return 'Имя контроллера не должно превышать 20 символов';
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return 'Имя контроллера может содержать только буквы и цифры';
    }
    return null;
  };

  // Функция валидации пароля
  const validatePassword = (pass) => {
    if (pass.length > 10) {
      return 'Пароль не должен превышать 10 символов';
    }
    return null;
  };

  // Общая функция валидации формы
  const validateForm = () => {
    const newErrors = {};

    const ipError = validateIP(ip);
    if (ipError) newErrors.ip = ipError;

    const deviceNameError = validateDeviceName(deviceName);
    if (deviceNameError) newErrors.deviceName = deviceNameError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Имитация функции подключения
const attemptConnection = async (ip, password, deviceName) => {
    // Здесь должна быть реальная логика подключения через WebSocket/API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Для демонстрации возвращаем ошибку
        resolve({
          success: false,
          message: 'Не удалось установить соединение с устройством. Проверьте IP-адрес и доступность сети.'
        });
      }, 1000);
    });
  };

const handleConnect = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Имитация подключения к C01
      const connectionResult = await attemptConnection(ip, password, deviceName);

      if (!connectionResult.success) {
        // Показываем модальное окно с ошибкой
        setErrorMessage(connectionResult.message || 'Не удалось подключиться к контроллеру C01');
        setIsErrorModalVisible(true);
        return;
      }

      // Успешное подключение — переход на экран управления
      router.push('/controller');
    } catch (error) {
      // Обработка сетевых ошибок и других исключений
      setErrorMessage('Произошла непредвиденная ошибка при подключении');
      setIsErrorModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../assets/status/connecting.png')}></Image>
        <Text style={styles.title}>Подключение к контроллеру</Text>
      </View>
      {/* Поле IP‑адреса */}
      <InputField
        label="IP‑адрес"
        placeholder="192.168.1.1"
        value={ip}
        onChangeText={setIp}
        error={errors.ip}
      />

      <InputField
        label="Пароль (если требуется)"
        placeholder="Введите пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

      <InputField
        label="Имя контроллера"
        placeholder="MyController"
        value={deviceName}
        onChangeText={setDeviceName}
        error={errors.deviceName}
      />

      <Button title="Подключиться" onPress={handleConnect} />
      <ErrorModal
        visible={isErrorModalVisible}
        message={errorMessage}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  block: {
    gap: 5,
    alignSelf: 'stretch'
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'normal'
  },
  label: {
    fontSize: 20,
    fontStyle: 'normal',
    color: '#1a225381'
  },
  placeholder: {
    color: '#999999'
  },
  input: {
    height: 50,
    borderColor: '#1a225381',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#96ced43d',
    fontSize: 20,
    alignSelf: 'stretch'
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#ffe6e6'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
    alignSelf: 'stretch'
  }
});
