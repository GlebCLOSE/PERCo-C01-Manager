import { Text } from "react-native";
import { useState } from "react";
import InputField from "../../components/ui/elements/input/InputField";
import DropdownInput from "../../components/ui/elements/input/DropdownInput";
import { Button } from "../../components/ui/elements/buttons/Button";

export default function CommandsScreen() {

    const [exdev, setExdev] = useState()

    const commandTypeList = [
        {label: 'Установка РКД', value: 'acm'},
        {label: 'Управление ИУ', value: 'exdev'},
        {label: 'Запрет прохода', value: 'access'}
    ]

    return (
        <>
            <Text>Команды</Text>
            <DropdownInput 
                label='Тип команды'
                items={commandTypeList}
                onChange={()=>{}}
            />
            <InputField 
                label='Номер ИУ'
                value=''
                placeholder="От 0 до 1"
                onChangeText={()=>{}}
                
            />
            <InputField 
                label='Номер ИУ'
                value=''
                placeholder="От 0 до 1"
                onChangeText={()=>{}}
                
            />
            <Button title='Отправить' onPress={()=>{}} size='M'/>
        </>
    );
}