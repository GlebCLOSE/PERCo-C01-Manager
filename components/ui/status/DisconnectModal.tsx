import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

interface DisconnectModalProps {
  visible: boolean;
  reconnecting?: boolean;
  onGoHome: () => void;
  onReconnect: () => void;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: p.overlayStrong,
    },
    modalContainer: {
      width: 300,
      padding: 20,
      backgroundColor: p.modalSurface,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: p.modalGlassBorder,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: p.modalPrimaryText,
    },
    modalMessage: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
      color: p.modalBodyMuted,
    },
    buttonsRow: {
      flexDirection: 'column',
      gap: 10,
      alignSelf: 'stretch',
    },
    primaryButton: {
      backgroundColor: p.modalActionBlue,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    secondaryButton: {
      backgroundColor: p.listRowBg,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: p.listRowBorder,
    },
    primaryButtonText: {
      color: p.textOnPrimary,
      fontWeight: 'bold',
    },
    secondaryButtonText: {
      color: p.listRowText,
      fontWeight: '600',
    },
  });
}

export default function DisconnectModal({
  visible,
  reconnecting = false,
  onGoHome,
  onReconnect,
}: DisconnectModalProps) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onGoHome}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Соединение разорвано</Text>
          <Text style={styles.modalMessage}>
            Связь с контроллером потеряна. Вы можете вернуться на главный экран или попробовать подключиться снова.
          </Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onReconnect}
              disabled={reconnecting}
            >
              {reconnecting ? (
                <ActivityIndicator color={palette.textOnPrimary} />
              ) : (
                <Text style={styles.primaryButtonText}>Переподключиться</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onGoHome} disabled={reconnecting}>
              <Text style={styles.secondaryButtonText}>На главную</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
