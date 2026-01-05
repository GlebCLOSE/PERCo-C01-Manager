import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



export const Header: React.FC = () => {
  return (
    <LinearGradient
      colors={['#1A2253', '#0F1987', '#008CC8']}
      style={styles.header}
    >
        <Text style={styles.headerText}>C01 Manager</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerText: {
    color: '#fcfcfcbd', // Цвет текста
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'inter'
  },
});