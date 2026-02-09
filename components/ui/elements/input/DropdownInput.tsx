import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

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
  const fontSize = isSmall ? 14 : 20;
  const padding = isSmall ? 8 : 12;

  const dynamicPickerStyles = {
    inputIOS: {
      ...pickerSelectStyles.commonInput,
      fontSize,
      paddingVertical: padding,
    },
    inputAndroid: {
      ...pickerSelectStyles.commonInput,
      fontSize,
      paddingVertical: padding,
    },
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, {fontSize: fontSize}]}>{label}</Text>}
      
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
  commonInput: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#1a225381',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#c3dde03d',
  },
};

export default DropdownInput;
