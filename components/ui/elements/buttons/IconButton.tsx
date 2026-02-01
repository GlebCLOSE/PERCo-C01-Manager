import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';

interface IconButtonProps {
  size: string;
  hasBorder: boolean;
  onPress: () => void;
  icon: ImageSourcePropType;
}


export const IconButton: React.FC<IconButtonProps> = ({ size, hasBorder, onPress, icon }) => {


  return (
    <TouchableOpacity
    style={[styles.button, hasBorder && styles.border]}
    onPress={onPress}
    >
        <Image style={styles.icon} source={icon}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  icon: {
    width: 20,
    height: 20
  },
  border: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00067057',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.12)',
  }
});