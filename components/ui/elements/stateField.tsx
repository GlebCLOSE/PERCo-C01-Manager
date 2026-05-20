import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

export interface StateFieldProps {
  title: string;
  value: string;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      backgroundColor: p.cardTint,
      borderWidth: 1,
      borderColor: p.inputBorder,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      padding: 5,
      borderRadius: 5,
      gap: 15,
    },
    textDark: {
      color: p.textSecondary,
      fontSize: 10,
      fontWeight: '200',
    },
    textLight: {
      color: p.textPrimary,
      fontSize: 10,
      fontWeight: '600',
    },
  });
}

export const StateField: React.FC<StateFieldProps> = ({ title, value }) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.container}>
      <Text style={styles.textDark}>{title}</Text>
      <Text style={styles.textLight}>{value}</Text>
    </View>
  );
};
