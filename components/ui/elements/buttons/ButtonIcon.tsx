import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  icon: ImageSourcePropType;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    button: {
      backgroundColor: p.primaryButton,
      paddingVertical: 15,
      paddingHorizontal: 35,
      borderRadius: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: 20,
      borderWidth: 1,
      borderColor: p.borderOnPrimary,
      boxShadow: p.buttonInsetShadow,
    },
    buttonText: {
      color: p.textOnPrimary,
      fontSize: 24,
      fontWeight: '200',
    },
  });
}

export const ButtonIcon: React.FC<CustomButtonProps> = ({ title, onPress, icon }) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={{ height: 24, width: 28.5 }} resizeMode="contain" />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};
