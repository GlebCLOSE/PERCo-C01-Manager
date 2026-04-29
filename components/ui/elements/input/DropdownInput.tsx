import React, { useMemo } from 'react';
import { View, Text, StyleSheet, type TextStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

interface DropdownItem {
  label: string;
  value: unknown;
}

interface Props {
  size?: 's' | 'm' | undefined;
  label?: string;
  items: DropdownItem[];
  placeholder?: string | object;
  onChange: (value: unknown) => void;
  value?: unknown;
}

function pickerStyles(p: AppPalette) {
  return {
    heightContainer: {
      height: 41,
    },
    placeholderText: {
      color: p.inputPlaceholder,
      fontSize: 20,
    } satisfies TextStyle,
    commonInput: {
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: p.inputBorder,
      borderRadius: 8,
      color: p.inputText,
      paddingRight: 30,
      backgroundColor: p.dropdownBg,
      height: 41,
      fontSize: 20,
      paddingVertical: 0,
      textAlignVertical: 'center',
    } satisfies TextStyle,
  };
}

function createLabelStyles(p: AppPalette) {
  return StyleSheet.create({
    label: {
      fontSize: 20,
      fontWeight: '400',
      color: p.inputLabel,
    },
  });
}

const DropdownInput: React.FC<Props> = ({
  size = 'm',
  label,
  items,
  placeholder,
  onChange,
  value,
}) => {
  const { palette } = useTheme();
  const labelStyles = useMemo(() => createLabelStyles(palette), [palette]);
  const ps = useMemo(() => pickerStyles(palette), [palette]);

  const isSmall = size === 's';
  const labelFontSize = isSmall ? 14 : 20;

  const dynamicPickerStyles = {
    inputIOS: ps.commonInput,
    inputAndroid: ps.commonInput,
    inputIOSContainer: ps.heightContainer,
    inputAndroidContainer: ps.heightContainer,
    placeholder: ps.placeholderText,
  };

  return (
    <View style={dropdownContainerStyle}>
      {label ? (
        <Text style={[labelStyles.label, { fontSize: labelFontSize }]}>{label}</Text>
      ) : null}

      <RNPickerSelect
        onValueChange={onChange}
        items={items}
        value={value}
        placeholder={placeholder ? { label: placeholder as string, value: null } : {}}
        style={dynamicPickerStyles}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
};

const dropdownContainerStyle = { gap: 5 };

export default DropdownInput;
