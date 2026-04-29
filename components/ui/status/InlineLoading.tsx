import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../providers/ThemeContext';

export function InlineLoading({ message = 'Загрузка данных...' }: { message?: string }) {
  const { palette } = useTheme();

  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={palette.loadingSpinner} />
      <Text style={[styles.caption, { color: palette.textPrimary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  caption: { marginTop: 10, fontSize: 16 },
});
