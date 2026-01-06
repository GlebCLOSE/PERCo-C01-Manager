import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  icon: ImageSourcePropType;
}


export const ButtonIcon: React.FC<CustomButtonProps> = ({ title, onPress, icon }) => {
  return (
    <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    >
        <Image source={icon}/>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  button: {
    backgroundColor: '#0375BB',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 20
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'light',
  },
});