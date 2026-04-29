import { View, Text, Image, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

function createStyles(_p: AppPalette) {
  return StyleSheet.create({
    status: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: _p.homeSubtleText,
      fontSize: 24,
      fontWeight: '100',
      fontFamily: 'inter',
      width: 185,
      textAlign: 'center',
    },
  });
}

export const NoConnection: React.FC = () => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.status}>
      <Image source={require('../../../assets/status/no_connection.png')} />
      <Text style={styles.text}>No controllers connected</Text>
    </View>
  );
};
