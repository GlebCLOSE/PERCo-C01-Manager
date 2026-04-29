import { View, Image, StyleSheet, Text } from 'react-native';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '../elements/buttons/Button';
import { attemptConnection } from '../../../utils/attemptConnection';
import { useController } from '../../../providers/ControllerContext';
import ErrorModal from '../status/ErrorModal';
import { removeDevice } from '../../../storage/deviceStorage';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

export interface RememberedDeviceProps {
  name: string;
  ip: string;
  password: string;
  small?: boolean;
  onDelete?: () => Promise<void>;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      padding: 7,
      backgroundColor: p.cardTint,
      borderWidth: 1,
      borderColor: p.cardBorder,
      boxShadow: p.cardShadowSoft,
      borderRadius: 5,
    },
    block: {
      gap: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameIp: {
      flexDirection: 'column',
      gap: 5,
    },
    text: {
      color: p.textSecondary,
      fontSize: 12,
      fontWeight: 'light',
    },
  });
}

export const RememberedDevice: React.FC<RememberedDeviceProps> = ({
  name,
  ip,
  password,
  small,
  onDelete,
}) => {
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { setGlobalSocket } = useController();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const handleConnect = async () => {
        try {
          const connectionResult = (await attemptConnection(ip, password)) as {
            success: boolean;
            socket?: WebSocket;
            message?: string;
          };

          if (connectionResult.success && connectionResult.socket) {
            setGlobalSocket(connectionResult.socket);
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
    <>
      <View style={styles.container}>
        <View style={styles.block}>
          <Image source={require('../../../assets/icons/controller.png')} />
          <View style={styles.nameIp}>
            <Text style={styles.text}>Имя: {name}</Text>
            <Text style={styles.text}>IP: {ip}</Text>
          </View>
        </View>
        <View style={styles.block}>
          {!small && (
            <Button
              title="X"
              onPress={() => void onDelete?.()}
              size="S"
              customStyles={{ backgroundColor: palette.primaryButtonDanger }}
            />
          )}
          <Button title="Подключить" onPress={handleConnect} size="S" />
        </View>
      </View>
      <ErrorModal
        visible={isErrorModalVisible}
        message={errorMessage}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </>
  );
};
