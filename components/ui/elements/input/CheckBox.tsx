import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Checkbox from 'expo-checkbox';

interface CheckBoxProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label: string;
}

export const CheckBox: React.FC<CheckBoxProps> = ({value, onValueChange, label}) => {

  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color={isChecked ? '#4630EB' : undefined}
      />
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10
  },
  text: {
    fontSize: 20,
    fontFamily: 'inter',
    fontWeight: '400',
    color: '#1a225381',
  }
});