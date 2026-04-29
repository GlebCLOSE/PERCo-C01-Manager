import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';

interface MyComponentProps {
  children: ReactNode;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    background: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    container: {
      flex: 1,
      backgroundColor: p.panelBg,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: p.panelBorder,
      boxShadow: p.panelShadow,
      padding: 15,
    },
  });
}

export const Main: React.FC<MyComponentProps> = ({ children }) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <LinearGradient
      colors={[...palette.mainGradient]}
      style={styles.background}
    >
      <View style={styles.container}>{children}</View>
    </LinearGradient>
  );
};
