import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from '../elements/buttons/IconButton';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

interface ErrorModalProps {
  title: string;
  visible: boolean;
  message: string;
  onClose: () => void;
  isWarn?: boolean;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: p.overlayStrong,
    },
    modalWrapper: {
      width: '80%',
      backgroundColor: p.modalGlass,
      borderRadius: 20,
      borderColor: p.modalGlassBorder,
      borderWidth: 1,
      overflow: 'hidden',
    },
    modalContainer: {
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: p.glassModalHeading,
    },
    modalMessage: {
      fontSize: 14,
      margin: 20,
      textAlign: 'center',
      color: p.glassModalBody,
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

export default function ModalText({
  title,
  visible,
  message,
  onClose,
}: ErrorModalProps) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const iconClose = require('../../../assets/icons/close.png');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalWrapper}>
          <BlurView
            intensity={48}
            tint={palette.blurTint}
            experimentalBlurMethod={'dimezisBlurView'}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.modalTitle}>{title}</Text>
              <IconButton
                hasBorder={false}
                onPress={onClose}
                size={'s'}
                icon={iconClose}
              />
            </View>
            <Text style={styles.modalMessage}>{message}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Понятно</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
