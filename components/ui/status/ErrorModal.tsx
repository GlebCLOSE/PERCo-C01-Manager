import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
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
    closeButton: {
      backgroundColor: p.modalActionBlue,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    closeButtonText: {
      color: p.textOnPrimary,
      fontWeight: 'bold',
    },
  });
}

export default function ErrorModal({
  visible,
  message,
  onClose,
}: ErrorModalProps) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ошибка подключения</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Понятно</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
