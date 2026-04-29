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
        <Image source={icon} style={{height: 24, width: 28.5}} resizeMode='contain'/>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0375BB',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.54)',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), inset -3px -3px 15px rgba(0, 0, 0, 0.25)',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 24,
    fontWeight: '200',
  },
});