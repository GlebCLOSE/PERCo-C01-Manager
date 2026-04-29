import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, type TextStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';

const arrowDropdownLight = require('../../../../assets/icons/arrow-dropdown-blue.png');
const arrowDropdownDark = require('../../../../assets/icons/dark-theme/arrow-dropdown-white.png');

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

  const CHEVRON_SIZE = isSmall ? 12 : 14;

  const dynamicPickerStyles = {
    inputIOS: ps.commonInput,
    inputAndroid: ps.commonInput,
    inputIOSContainer: ps.heightContainer,
    inputAndroidContainer: ps.heightContainer,
    placeholder: ps.placeholderText,
    iconContainer: {
      justifyContent: 'center' as const,
      alignSelf: 'center' as const,
      height: 41,
      paddingRight: 10,
      marginTop: 0,
    },
  };

  const DropdownChevron = useMemo(() => {
    const source = palette.scheme === 'dark' ? arrowDropdownDark : arrowDropdownLight;
    return function Chevron(props: { testID?: string }) {
      return (
        <View testID={props.testID}>
          <Image
            source={source}
            style={{ width: CHEVRON_SIZE + 10, height: CHEVRON_SIZE }}
            resizeMode="contain"
          />
        </View>
      );
    };
  }, [palette.scheme, CHEVRON_SIZE]);

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
        Icon={DropdownChevron}
      />
    </View>
  );
};

const dropdownContainerStyle = { gap: 5 };

export default DropdownInput;
