import React, { useMemo } from 'react';
import { Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

interface IconButtonProps {
  size: string;
  hasBorder: boolean;
  onPress: () => void;
  icon: ImageSourcePropType;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    icon: {
      width: 20,
      height: 20
    },
    border: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: p.iconButtonBorder,
      boxShadow: p.panelShadow,
    }
  });
}

export const IconButton: React.FC<IconButtonProps> = ({ size, hasBorder, onPress, icon }) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <TouchableOpacity
      style={[styles.button, hasBorder && styles.border]}
      onPress={onPress}
    >
      <Image style={styles.icon} source={icon} />
    </TouchableOpacity>
  );
};
