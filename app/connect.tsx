import { TextInput, View, Text, Image } from 'react-native';
import { Button } from '../components/ui/elements/buttons/Button';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import InputField from '../components/ui/elements/input/InputField';
import ErrorModal from '../components/ui/status/ErrorModal';
import { attemptConnection } from '../utils/attemptConnection';
import { useController } from '../providers/ControllerContext';
import { saveDevice } from '../storage/deviceStorage';

import { validateIP } from '../utils/validation/validateIP';
import { validateDeviceName } from '../utils/validation/validateDeviceName'
import { validatePassword } from '../utils/validation/validatePassword';
import Checkbox from 'expo-checkbox'

export default function ConnectForm() {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [errors, setErrors] = useState({});
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecked, setChecked] = useState(false);
  const router = useRouter()
  const { setGlobalSocket, isConnected } = useController();


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

  const handleConnect = async () => {
    if (!validateForm()) {
      return;
    }

      
    // Если чекбокс "Запомнить устройство" отмечен - сохранить устройство
    if(isChecked){
      saveDevice(deviceName, ip, password)
    }


    try {
      
      const connectionResult = await attemptConnection(ip, password);

      if(connectionResult.success) {
        setGlobalSocket(connectionResult.socket)
      }

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
        keyboardType="numeric"
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

      <View style={styles.checkbox}>
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        <Text style={styles.text}>Запомнить устройство</Text>
      </View>

      <Button
        title="Подключиться"
        onPress={handleConnect}
        size={'M'}
      />
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
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10
  },
  text: {
    fontSize: 20,
    fontFamily: 'inter',
    fontWeight: '400',
    color: '#1a225381',
  }
});
