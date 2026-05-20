import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, type TextStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../../../../providers/ThemeContext';
import type { AppPalette } from '../../../../constants/theme';
import { themedIcon } from '../../../../constants/themedIcons';

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
  const { palette, scheme } = useTheme();
  const labelStyles = useMemo(() => createLabelStyles(palette), [palette]);
  const ps = useMemo(() => pickerStyles(palette), [palette]);

  const isSmall = size === 's';
  const labelFontSize = isSmall ? 14 : 20;

  /** Было ~12×22 / 14×24; уменьшено в 1.5 раза для компактности */
  const chevronHeight = Math.round((isSmall ? 12 : 14) / 1.5);
  const chevronWidth = Math.round(((isSmall ? 12 : 14) + 10) / 1.5);

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
      paddingRight: 8,
      marginTop: 0,
      /** Иначе Android: прозрачный Picker поверх поля не получает hit по зоне иконки */
      pointerEvents: 'none' as const,
    },
  };

  const DropdownChevron = useMemo(() => {
    const source = themedIcon('arrowDropdown', scheme);
    return function Chevron(props: { testID?: string }) {
      return (
        <View testID={props.testID} pointerEvents="none">
          <Image
            source={source}
            style={{ width: chevronWidth, height: chevronHeight }}
            resizeMode="contain"
          />
        </View>
      );
    };
  }, [scheme, chevronWidth, chevronHeight]);

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
        /** На Android без этого TouchableOpacity с пустым onPress перехватывает жесты до Picker */
        fixAndroidTouchableBug
        Icon={DropdownChevron}
      />
    </View>
  );
};

const dropdownContainerStyle = { gap: 5 };

export default DropdownInput;
