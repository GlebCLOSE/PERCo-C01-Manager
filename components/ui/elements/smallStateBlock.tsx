import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

export interface SmallStateBlockProps {
  title: string;
  value: string;
  bottomBlockStyle: object;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      backgroundColor: p.scheme === 'light' ? '#ffffffa1' : 'rgba(45, 58, 92, 0.75)',
      borderWidth: 1,
      borderColor: p.inputBorder,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 5,
    },
    top: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
    bottom: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      width: '100%',
    },
    textDark: {
      color: p.textPrimary,
      fontSize: 10,
      fontWeight: '200',
    },
    textLight: {
      color: 'rgba(255, 255, 255, 0.88)',
      fontSize: 10,
      fontWeight: '600',
    },
  });
}

export const SmallStateBlock: React.FC<SmallStateBlockProps> = ({
  title,
  value,
  bottomBlockStyle,
}) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.textDark}>{title}</Text>
      </View>
      <View style={[styles.bottom, bottomBlockStyle]}>
        <Text style={styles.textLight}>{value}</Text>
      </View>
    </View>
  );
};
