import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  icon: ImageSourcePropType;
  isYellow?: boolean
}


export const ButtonSquare: React.FC<CustomButtonProps> = ({ title, onPress, icon, isYellow }) => {
  return (
    <TouchableOpacity
    style={[styles.button, isYellow && styles.buttonYellow]}
    onPress={onPress}
    >
        <Image source={icon} style={{height: 34, width: 34}}/>
        <Text style={[styles.buttonText, isYellow && styles.textYellow]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  button: {
    width: 100,
    height: 95,
    backgroundColor: '#FFFFFF',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#000670c2',
    boxShadow: '0px 0px 4px #0000003d'
  },
  buttonYellow: {
    backgroundColor: '#FFE7C3',
    borderColor: '#703A00'
  },
  buttonText: {
    color: '#000670c2',
    fontSize: 10,
    fontWeight: '200',
    textAlign: 'center'
  },
  textYellow: {
    color: '#703A00'
  }
});