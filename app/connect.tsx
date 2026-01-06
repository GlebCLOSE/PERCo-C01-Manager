import { TextInput, Button, View, Text, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function ConnectForm() {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [errors, setErrors] = useState({});
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

  const handleConnect = () => {
    // Сначала валидируем форму
    if (!validateForm()) {
      return; // Останавливаем выполнение, если есть ошибки
    }

    // Если валидация пройдена, выполняем подключение
    console.log('Данные для подключения:', { ip, password, deviceName });
    router.push('/controller');
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../assets/status/connecting.png')}></Image>
        <Text style={styles.title}>Подключение к контроллеру</Text>
      </View>
      {/* Поле IP‑адреса */}
      <View style={styles.block}>
        <Text style={styles.label}>IP-адрес</Text>
        <TextInput
            placeholder="IP‑адрес"
            placeholderTextColor="#010f5e3d"
            value={ip}
            onChangeText={setIp}
            style={[
            styles.input,
            errors.ip && styles.inputError
            ]}
        />
        {errors.ip && (
            <Text style={styles.errorText}>{errors.ip}</Text>
        )}
      </View>

      {/* Поле пароля */}
      <View style={styles.block}>
        <Text style={styles.label}>Пароль (если установлен)</Text>
            <TextInput
                placeholder="Пароль"
                placeholderTextColor="#010f5e3d"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[
                styles.input,
                errors.password && styles.inputError
                ]}
            />
            {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
            )}
      </View>

      {/* Поле имени контроллера */}
      <View style={styles.block}>
        <Text style={styles.label}>Имя устройства</Text>
        <TextInput
            placeholder="Имя устройства"
            placeholderTextColor="#010f5e3d"
            value={deviceName}
            onChangeText={setDeviceName}
            style={[
            styles.input,
            errors.deviceName && styles.inputError
            ]}
        />
        {errors.deviceName && (
            <Text style={styles.errorText}>{errors.deviceName}</Text>
        )}
      </View>

      <Button title="Подключиться" onPress={handleConnect} />
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
