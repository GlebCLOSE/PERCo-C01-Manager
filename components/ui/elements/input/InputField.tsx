import React, { useMemo } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

interface InputFieldProps {
  size?: 's' | 'm' | undefined;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'number-pad' | 'decimal-pad';
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    container: {
      alignSelf: 'stretch'
    },
    label: {
      fontSize: 20,
      fontStyle: 'normal',
      color: p.inputLabel,
    },
    labelSmall: {
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '300',
      color: p.inputLabel,
    },
    input: {
      height: 41,
      borderColor: p.inputBorder,
      borderWidth: 1,
      paddingHorizontal: 15,
      borderRadius: 8,
      backgroundColor: p.inputBg,
      fontSize: 20,
      color: p.inputText,
      alignSelf: 'stretch',
      paddingVertical: 0,
      textAlignVertical: 'center',
    },
    inputSmall: {
      height: 41,
      borderColor: p.inputBorder,
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: p.inputBg,
      fontSize: 20,
      color: p.inputText,
      alignSelf: 'stretch',
      paddingVertical: 0,
      textAlignVertical: 'center',
    },
    inputError: {
      borderColor: 'red',
      backgroundColor: p.inputErrorBg,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      fontSize: 12,
      alignSelf: 'stretch',
    },
  });
}

export default function InputField({
  size = 'm',
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
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  let inputStyle = styles.input;
  let labelStyle = styles.label;

  if (size === 's') {
    inputStyle = styles.inputSmall;
    labelStyle = styles.labelSmall;
  }

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.inputPlaceholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        style={[inputStyle, error && styles.inputError]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
