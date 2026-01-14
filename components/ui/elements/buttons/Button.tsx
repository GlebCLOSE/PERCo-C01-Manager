import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

enum Size {
  S = 'S',
  M = 'M',
  L = 'L'
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
  borderRadiusStyle?: BorderRadiusStyle; // Новый пропс для стиля скругления
  customStyles?: object;                // Дополнительный пропс для кастомных стилей
}

export const Button: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  size,
  borderRadiusStyle = BorderRadiusStyle.ROUNDED,
  customStyles = {}
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
    }
  };

  // Базовые стили для размеров
  const sizeStyles = {
    [Size.S]: styles.buttonSmall,
    [Size.M]: styles.buttonMedium,
    [Size.L]: styles.buttonLarge
  };

  const baseStyle = sizeStyles[size];
  const halfHeight = baseStyle.paddingVertical; // Половина высоты кнопки
  const coefficient = radiusCoefficients[size][borderRadiusStyle];
  const borderRadius = halfHeight * coefficient;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        baseStyle,
        { borderRadius },
        customStyles // Пользовательские стили (переопределяют всё)
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0375BB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 14
  },
  buttonMedium: {
    paddingVertical: 15,
    paddingHorizontal: 35,
    fontSize: 24
  },
  buttonLarge: {
    paddingVertical: 20,
    paddingHorizontal: 50,
    fontSize: 32
  },
  buttonLong: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'normal',
    textAlign: 'center'
  }
});