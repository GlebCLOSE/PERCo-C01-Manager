import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, BorderRadiusStyle } from '../../components/ui/elements/buttons/Button';
import checkIcon from '../../assets/status/connected.png';
import { useRouter } from 'expo-router';
import { useController } from '../../providers/ControllerContext';
import { Slot } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../providers/ThemeContext';
import type { AppPalette } from '../../constants/theme';
import DisconnectModal from '../../components/ui/status/DisconnectModal';
import ErrorModal from '../../components/ui/status/ErrorModal';

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: p.textPrimary,
    },
  });
}

export default function ControllerScreen() {
  const router = useRouter();
  const { ipAddress, isConnected, disconnect, reconnectToController } = useController();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const wasEverConnectedRef = useRef(false);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isConnected) {
      wasEverConnectedRef.current = true;
      setDisconnectModalVisible(false);
      return;
    }
    if (wasEverConnectedRef.current) {
      setDisconnectModalVisible(true);
    }
  }, [isConnected]);

  const handleGoHome = () => {
    setDisconnectModalVisible(false);
    disconnect();
    router.replace('/');
  };

  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      const result = await reconnectToController();
      if (result.ok) {
        setDisconnectModalVisible(false);
        return;
      }
      if (result.needManualConnect) {
        setDisconnectModalVisible(false);
        router.push('/connect');
        return;
      }
      setErrorMessage(result.message);
      setErrorModalVisible(true);
    } finally {
      setReconnecting(false);
    }
  };

  return (
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={checkIcon} style={{ width: 75, height: 72 }} />
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: palette.textPrimary,
            }}
          >
            Контроллер: {ipAddress ?? 'Не определен'}{' '}
          </Text>
          <Text style={{ fontSize: 14, color: palette.textSecondary }}>
            Статус: {isConnected ? 'В сети' : 'Оффлайн'}
          </Text>
          <Button
            title="Состояние"
            onPress={() => router.push('/controller/state')}
            size="S"
            borderRadiusStyle={BorderRadiusStyle.SHARP}
            customStyles={{
              backgroundColor: palette.listRowBg,
              borderWidth: 1,
              borderColor: palette.listRowBorder,
            }}
            customTextStyles={{ color: palette.listRowText }}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <Slot />
      <DisconnectModal
        visible={disconnectModalVisible}
        reconnecting={reconnecting}
        onGoHome={handleGoHome}
        onReconnect={handleReconnect}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </View>
  );
}
