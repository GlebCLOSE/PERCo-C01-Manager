import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MyComponentProps {
  children: ReactNode; // поддерживает текст, элементы, массивы и т. д.
}

export const Main: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={['#DDE3F2', '#F6F9FF', '#CFD8EE']}
      style={styles.background}
    >
      <View style={styles.container}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff33',
    borderRadius: 15,
    borderColor: '#000670d0',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)'
  },
});