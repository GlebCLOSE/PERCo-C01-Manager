import { View, Text, Image } from 'react-native';
import { Button } from '../components/ui/elements/buttons/Button';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import InputField from '../components/ui/elements/input/InputField';
import IPAddressInput from '../components/ui/elements/input/IPAddressInput';
import ErrorModal from '../components/ui/status/ErrorModal';
import { attemptConnection } from '../utils/attemptConnection';
import { useController } from '../providers/ControllerContext';
import { saveDevice } from '../storage/deviceStorage';
import { useTheme } from '../providers/ThemeContext';
import type { AppPalette } from '../constants/theme';

import { validateIP } from '../utils/validation/validateIP';
import { validateDeviceName } from '../utils/validation/validateDeviceName';
import { validatePassword } from '../utils/validation/validatePassword';
import Checkbox from 'expo-checkbox';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    title: {
      fontSize: 24,
      marginBottom: 30,
      fontWeight: '300',
      color: p.screenTitle,
    },
    checkbox: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      gap: 10,
    },
    text: {
      fontSize: 20,
      fontFamily: 'inter',
      fontWeight: '400',
      color: p.screenMutedText,
    },
  });
}

export default function ConnectForm() {
  const [ip, setIp] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecked, setChecked] = useState(false);
  const router = useRouter();
  const { setGlobalSocket, appendTransportLogEntry } = useController();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    if (isChecked) {
      saveDevice(deviceName, ip, password);
    }

    try {
      const connectionResult = (await attemptConnection(ip, password, {
        onTransportLog: appendTransportLogEntry,
      })) as {
        success: boolean;
        socket?: WebSocket;
        message?: string;
      };

      if (connectionResult.success && connectionResult.socket) {
        setGlobalSocket(connectionResult.socket, password);
      }

      if (!connectionResult.success) {
        setErrorMessage(
          connectionResult.message ||
            'Не удалось подключиться к контроллеру C01',
        );
        setIsErrorModalVisible(true);
        return;
      }

      router.push('/controller');
    } catch {
      setErrorMessage('Произошла непредвиденная ошибка при подключении');
      setIsErrorModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../assets/status/connecting.png')} />
        <Text style={styles.title}>Подключение к контроллеру</Text>
      </View>
      <IPAddressInput
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

      <View style={styles.checkbox}>
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? palette.checkboxChecked : undefined}
        />
        <Text style={styles.text}>Запомнить устройство</Text>
      </View>

      <Button title="Подключиться" onPress={handleConnect} size={'M'} />
      <ErrorModal
        visible={isErrorModalVisible}
        message={errorMessage}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </View>
  );
}
