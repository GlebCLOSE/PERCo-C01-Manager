import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

export enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  Long = 'Long'
}

export type ButtonSize = 'S' | 'M' | 'L' | 'Long';

export enum BorderRadiusStyle {
  SHARP = 'sharp',
  ROUNDED = 'rounded',
  CIRCLE = 'circle'
}

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  size: ButtonSize;
  isWarn?: boolean;
  borderRadiusStyle?: BorderRadiusStyle;
  customStyles?: object;
  customTextStyles?: object;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    button: {
      backgroundColor: p.primaryButton,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      boxShadow: p.buttonInsetShadow,
    },
    buttonWarn: {
      backgroundColor: p.primaryButtonDanger,
    },
    buttonSmall: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      fontSize: 11
    },
    buttonMedium: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontSize: 24
    },
    buttonLarge: {
      paddingVertical: 19,
      paddingHorizontal: 35,
      fontSize: 32
    },
    buttonLong: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 25,
      justifyContent: 'flex-start',
      fontSize: 24,
      borderWidth: 1,
      borderColor: p.borderOnPrimary,
    },
    buttonText: {
      color: p.textOnPrimary,
      fontWeight: 'normal',
      textAlign: 'center'
    },
    textSmall: {
      fontSize: 10
    },
    textMedium: {
      fontSize: 16
    },
    textLarge: {
      fontSize: 20
    }
  });
}

export const Button: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  size,
  isWarn = false,
  borderRadiusStyle = BorderRadiusStyle.ROUNDED,
  customStyles = {},
  customTextStyles = {}
}) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const radiusCoefficients = {
    [Size.S]: {
      [BorderRadiusStyle.SHARP]: 0.3,
      [BorderRadiusStyle.ROUNDED]: 0.5,
      [BorderRadiusStyle.CIRCLE]: 0.8
    },
    [Size.M]: {
      [BorderRadiusStyle.SHARP]: 0.4,
      [BorderRadiusStyle.ROUNDED]: 0.7,
      [BorderRadiusStyle.CIRCLE]: 1.0
    },
    [Size.L]: {
      [BorderRadiusStyle.SHARP]: 0.5,
      [BorderRadiusStyle.ROUNDED]: 0.8,
      [BorderRadiusStyle.CIRCLE]: 1.2
    },
    [Size.Long]: {
      [BorderRadiusStyle.SHARP]: 0.5,
      [BorderRadiusStyle.ROUNDED]: 0.8,
      [BorderRadiusStyle.CIRCLE]: 1.2
    },
  };

  const sizeStyles = {
    [Size.S]: styles.buttonSmall,
    [Size.M]: styles.buttonMedium,
    [Size.L]: styles.buttonLarge,
    [Size.Long]: styles.buttonLong
  };

  const textSizeStyles = {
    [Size.S]: styles.textSmall,
    [Size.M]: styles.textMedium,
    [Size.L]: styles.textLarge,
    [Size.Long]: styles.textLarge
  };

  const baseTextStyle = textSizeStyles[size];
  const baseStyle = sizeStyles[size];
  const halfHeight = baseStyle.paddingVertical;
  const coefficient = radiusCoefficients[size][borderRadiusStyle];
  const borderRadius = halfHeight * coefficient;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        baseStyle,
        isWarn && styles.buttonWarn,
        { borderRadius },
        customStyles
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        baseTextStyle,
        customTextStyles
      ]}>{title}</Text>
    </TouchableOpacity>
  );
};
