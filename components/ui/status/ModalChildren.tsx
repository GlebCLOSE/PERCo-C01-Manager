import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from '../elements/buttons/IconButton';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

interface ErrorModalProps {
  title: string;
  visible: boolean;
  isWarn?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
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
      width: '90%',
      backgroundColor: p.modalGlass,
      borderRadius: 20,
      borderColor: p.modalGlassBorder,
      borderWidth: 1,
      overflow: 'hidden',
    },
    wrapperWarn: {
      backgroundColor: p.modalGlassWarn,
      borderRadius: 20,
      borderColor: p.modalGlassBorder,
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
    titleWarn: {
      color: p.modalTitleWarn,
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

export const ModalChildren = ({
  title,
  visible,
  isWarn = false,
  onClose,
  children,
}: ErrorModalProps) => {
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
        <View style={[styles.modalWrapper, isWarn && styles.wrapperWarn]}>
          <BlurView
            intensity={68}
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
              <Text style={[styles.modalTitle, isWarn && styles.titleWarn]}>
                {title}
              </Text>
              <IconButton
                hasBorder={false}
                onPress={onClose}
                size={'s'}
                icon={iconClose}
              />
            </View>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};
