import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface InputFieldProps {
  size?: 's' | 'm' |undefined;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'number-pad' | 'decimal-pad'; // Доступные типы клавиатуры
}

export default function InputField({
  size='m',
  label,
  value,
  onChangeText,
  error,
  placeholder = '',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default'
}: InputFieldProps) {

  let inputStyle = styles.input
  let labelStyle = styles.label

  if(size==='s'){
    inputStyle = styles.inputSmall
    labelStyle = styles.labelSmall
  }

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#010f5e3d"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        style={[
          inputStyle,
          error && styles.inputError
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },
  label: {
    fontSize: 20,
    fontStyle: 'normal',
    color: '#1a225381'
  },
  labelSmall: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '300',
    color: '#1a225381'
  },
  placeholder: {
    color: '#999999'
  },
  input: {
    height: 50,
    borderColor: '#1a225381',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#96ced43d',
    fontSize: 20,
    alignSelf: 'stretch'
  },
  inputSmall: {
    height: 37,
    borderColor: '#1a225381',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#96ced43d',
    fontSize: 14,
    alignSelf: 'stretch'
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#ffe6e6'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
    alignSelf: 'stretch'
  }
});