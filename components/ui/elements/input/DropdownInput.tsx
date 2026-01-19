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
  label?: string;
  items: DropdownItem[];
  placeholder?: string | object;
  onChange: (value: any) => void;
  value?: any;
}

const DropdownInput: React.FC<Props> = ({ label, items, placeholder, onChange, value }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <RNPickerSelect
        onValueChange={onChange}
        items={items}
        value={value}
        placeholder={placeholder ? { label: placeholder, value: null } : {}}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false} // Чтобы кастомные стили работали на Android
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
    width: '100%',
  },
  label: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1a225381',
  },
});

// Стилизация самого выпадающего списка
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#1a225381',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // место для иконки
    backgroundColor: '#96ced41e',
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1a225381',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#c3dde03d',
  },
});

export default DropdownInput;

const styles1 = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },
  label: {
    fontSize: 20,
    fontStyle: 'normal',
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