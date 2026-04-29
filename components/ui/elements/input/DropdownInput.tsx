import React from 'react';
import { View, Text, StyleSheet, type TextStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

/** Тёмно-синий текст выбранного значения в строке выпадающего списка. */
const FIELD_TEXT_COLOR = '#1A2253';

/** Текст плейсхолдера («выберите…»): тот же синий тон, прозрачнее значения поля */
const PLACEHOLDER_TEXT_COLOR = 'rgba(26, 34, 83, 0.28)';

// Описываем интерфейс элемента списка
interface DropdownItem {
  label: string;
  value: any;
}

// Описываем пропсы компонента
interface Props {
  size?: 's' | 'm' | undefined;
  label?: string;
  items: DropdownItem[];
  placeholder?: string | object;
  onChange: (value: any) => void;
  value?: any;
}

const DropdownInput: React.FC<Props> = ({ size='m', label, items, placeholder, onChange, value }) => {

  const isSmall = size === 's';
  const labelFontSize = isSmall ? 14 : 20;

  const dynamicPickerStyles = {
    inputIOS: pickerSelectStyles.commonInput,
    inputAndroid: pickerSelectStyles.commonInput,
    inputIOSContainer: pickerSelectStyles.heightContainer,
    inputAndroidContainer: pickerSelectStyles.heightContainer,
    placeholder: pickerSelectStyles.placeholderText,
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { fontSize: labelFontSize }]}>{label}</Text>}
      
      <RNPickerSelect
        onValueChange={onChange}
        items={items}
        value={value}
        placeholder={placeholder ? { label: placeholder, value: null } : {}}
        style={dynamicPickerStyles}
        useNativeAndroidPickerStyle={false} // Чтобы кастомные стили работали на Android
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1a225381',
  },
});

// Стилизация самого выпадающего списка
const pickerSelectStyles = {
  heightContainer: {
    height: 41,
  },
  placeholderText: {
    color: PLACEHOLDER_TEXT_COLOR,
    fontSize: 20,
  } satisfies TextStyle,
  commonInput: {
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#1a225381',
    borderRadius: 8,
    color: FIELD_TEXT_COLOR,
    paddingRight: 30,
    backgroundColor: '#c3dde03d',
    height: 41,
    fontSize: 20,
    paddingVertical: 0,
    textAlignVertical: 'center',
  } satisfies TextStyle,
};

export default DropdownInput;
