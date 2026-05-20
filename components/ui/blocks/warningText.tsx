import { Text, View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

export const WarningText = ({ text }: { text: string }) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor:
        p.scheme === 'dark' ? 'rgba(255, 140, 80, 0.18)' : '#ff741049',
      borderWidth: 1,
      borderColor: p.scheme === 'dark' ? 'rgba(255, 160, 100, 0.45)' : '#934107c9',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontFamily: 'inter',
      fontWeight: '200',
      fontSize: 16,
      color: p.textPrimary,
    },
  });
}
