import { Text, StyleSheet } from "react-native";
import { useState } from "react";
import InputField from "../../components/ui/elements/input/InputField";
import DropdownInput from "../../components/ui/elements/input/DropdownInput";
import { Button } from "../../components/ui/elements/buttons/Button";

export default function CommandsScreen() {

    const [exdev, setExdev] = useState()
    const [selectedValue, setSelectedValue] = useState('');
    const [acmValue, setAcmValue] = useState('');
    const [exdevCommandValue, setExdevCommandValue] = useState('');
    const [exdevNumber, setExdevNumber] = useState('0')
    const [exdevDirNumber, setExdevDirNumber] = useState('0')
    const [exdevUnlockTime, setExdevUnlockTime] = useState('1000')


    const commandTypeList = [
        {label: 'Установка РКД', value: 'acm'},
        {label: 'Управление ИУ', value: 'exdev'},
        {label: 'Запрет прохода', value: 'access'}
    ]


    //функция исполнения команды
    const executeComand = () => {

        //тип команды зависит от типа selectedValue(при разных типах)
        if(selectedValue==='acm'){

        }
        if(selectedValue==='exdev'){

        }
        if(selectedValue==='access'){
            
        }

        // отправка команды и получение ответа(вывод можно в alert сделать)
        return ;
    }

    return (
        <>
            <Text style={styles.text}>Команды</Text>
            <DropdownInput 
                label='Тип команды'
                items={commandTypeList}
                onChange={(itemValue) => setSelectedValue(itemValue)}
            />
            <InputField 
                label='Номер ИУ'
                value='0'
                placeholder="От 0 до 1"
                onChangeText={(value)=>{setExdevNumber(value)}}
            />
            <InputField 
                label='Номер направления'
                value=''
                placeholder="От 0 до 1"
                onChangeText={(value)=>{setExdevDirNumber(value)}}
                
            />
            {selectedValue==='acm' && (
                <DropdownInput 
                    label='Выбор РКД'
                    items={[{label: 'РКД Открыто', value: 'open'}, {label: 'РКД Контроль', value: 'control'}]}
                    onChange={(itemValue) => setAcmValue(itemValue)}
                />
            )}
            {selectedValue==='exdev' && (
                <>
                    <DropdownInput 
                        label='Тип команды'
                        items={[{label: 'Открыть ИУ', value: 'open'}, {label: 'Заблокировать ИУ', value: 'close'}]}
                        onChange={(itemValue) => setExdevCommandValue(itemValue)}
                    />
                    <InputField 
                        label='Время разблокировки'
                        value=''
                        placeholder="В миллисекундах"
                        onChangeText={(value)=>{setExdevUnlockTime(value)}}
                    />
                </>
            )}
            <Button title='Отправить' onPress={()=>{}} size='M'/>
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'inter',
        fontSize: 20,
        
    }
})