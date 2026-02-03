import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  Long = 'Long'
}

enum BorderRadiusStyle {
  SHARP = 'sharp',      // острые углы
  ROUNDED = 'rounded',  // стандартное скругление
  CIRCLE = 'circle'     // максимальное скругление (почти круг)
}

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  size: Size;
  isWarn?: boolean;
  borderRadiusStyle?: BorderRadiusStyle; // Новый пропс для стиля скругления
  customStyles?: object;                // Дополнительный пропс для кастомных стилей
  customTextStyles?: object;            // Пропс для кастомных стилей текста кнопки
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
  // Коэффициенты скругления: [размер][стиль]
  const radiusCoefficients = {
    [Size.S]: {
      [BorderRadiusStyle.SHARP]: 0.3,   // 30 % от половины высоты
      [BorderRadiusStyle.ROUNDED]: 0.5,  // 50 %
      [BorderRadiusStyle.CIRCLE]: 0.8       // 80 %
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

  // Базовые стили для размеров
  const sizeStyles = {
    [Size.S]: styles.buttonSmall,
    [Size.M]: styles.buttonMedium,
    [Size.L]: styles.buttonLarge,
    [Size.Long]: styles.buttonLong
  };

  // Базовые стили для текста внутри кнопки
  const textSizeStyles = {
    [Size.S]: styles.textSmall,
    [Size.M]: styles.textMedium,
    [Size.L]: styles.textLarge,
    [Size.Long]: styles.textLarge
  }

  const baseTextStyle = textSizeStyles[size]
  const baseStyle = sizeStyles[size];
  const halfHeight = baseStyle.paddingVertical; // Половина высоты кнопки
  const coefficient = radiusCoefficients[size][borderRadiusStyle];
  const borderRadius = halfHeight * coefficient;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        baseStyle,
        isWarn&&styles.buttonWarn,
        { borderRadius },
        customStyles // Пользовательские стили (переопределяют всё)
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

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0375BB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), inset -3px -3px 15px rgba(0, 0, 0, 0.25)',
  },
  buttonWarn: {
    backgroundColor: '#BB0306',
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
    borderColor: '#ffffff94',
  },
  buttonText: {
    color: '#FFFFFF',
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