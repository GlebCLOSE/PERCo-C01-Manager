import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  icon: ImageSourcePropType;
  isYellow?: boolean;
}

function imageRemountKey(source: ImageSourcePropType, scheme: string): string {
  if (typeof source === 'number') {
    return `${scheme}:${source}`;
  }
  const r = Image.resolveAssetSource(source);
  return `${scheme}:${r.uri}`;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    button: {
      width: 100,
      height: 95,
      backgroundColor: p.squareCardBg,
      paddingVertical: 11,
      paddingHorizontal: 18,
      borderRadius: 10,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: p.squareCardBorder,
      boxShadow: p.squareCardShadow,
    },
    buttonYellow: {
      backgroundColor: p.squareCardYellowBg,
      borderColor: p.squareCardYellowBorder,
    },
    buttonText: {
      color: p.squareCardText,
      fontSize: 10,
      fontWeight: '300',
      textAlign: 'center',
    },
    textYellow: {
      color: p.squareCardYellowText,
    },
  });
}

export const ButtonSquare: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  icon,
  isYellow,
}) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const iconKey = useMemo(
    () => imageRemountKey(icon, palette.scheme),
    [icon, palette.scheme],
  );

  return (
    <TouchableOpacity
      style={[styles.button, isYellow && styles.buttonYellow]}
      onPress={onPress}
    >
      <Image
        key={iconKey}
        source={icon}
        style={{ height: 34, width: 34 }}
        resizeMode="contain"
      />
      <Text style={[styles.buttonText, isYellow && styles.textYellow]}>{title}</Text>
    </TouchableOpacity>
  );
};
