import { Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import InputField from "../../components/ui/elements/input/InputField";
import DropdownInput from "../../components/ui/elements/input/DropdownInput";
import { Button } from "../../components/ui/elements/buttons/Button";
import { useControllerCommands } from "../../hooks/useControllerCommands";
import ErrorModal from '../../components/ui/status/ErrorModal'
import ModalText from "../../components/ui/status/ModalText";

export default function CommandsScreen() {

    const { setAccessMode, toggleExdevAction, requestDeviceState, declineAccessAction, isConnected } = useControllerCommands()
    const [selectedValue, setSelectedValue] = useState('acm');
    const [accessModeValue, setAccessModeValue] = useState('open');
    const [exdevActionValue, setExdevActionValue] = useState('open');
    const [exdevNumber, setExdevNumber] = useState('0')
    const [exdevDirNumber, setExdevDirNumber] = useState('0')
    const [exdevUnlockTime, setExdevUnlockTime] = useState('1000')
    const [openType, setOpenType] = useState('open once')
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [resultMessage, setResultMessage] = useState('');


    const commandTypeList = [
        {label: 'Установка РКД', value: 'acm'},
        {label: 'Управление ИУ', value: 'exdev'},
        {label: 'Запрет прохода', value: 'access'}
    ]


    //функция исполнения команды
    const executeCommand = async () => {

        // добавить обработку ответа от контроллера
        if(!isConnected){
            setErrorMessage('Команда не может быть отправлена, так как контроллер не подключен')
            setIsErrorModalVisible(true)
            return ;
        }

        //тип команды зависит от типа selectedValue(при разных типах)
        if(selectedValue==='acm'){

            const result = await setAccessMode(accessModeValue, exdevNumber, exdevDirNumber)
            if(result==='success'){
                setIsModalVisible(true)
                setResultMessage('Установка РКД успешна')
            }
        }
        if(selectedValue==='exdev'){

            toggleExdevAction(exdevActionValue, exdevNumber, exdevDirNumber, exdevUnlockTime, openType)

        }
        if(selectedValue==='access'){

            declineAccessAction(exdevNumber, exdevDirNumber)

        }
        setErrorMessage('Команда отправлена')
        setIsErrorModalVisible(true)

        // отправка команды и получение ответа(вывод можно в alert сделать)
        return ;
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
            <Text style={styles.text}>Меню команд</Text>
            <DropdownInput 
                label='Тип команды'
                items={commandTypeList}
                value={selectedValue}
                onChange={setSelectedValue}
            />
            <DropdownInput 
                label='Выбор ИУ'
                items={[{label: 'Замок №1', value: '0'}, {label: 'Замок №2', value: '1'}]}
                value={exdevNumber}
                onChange={setExdevNumber}
            />
            <DropdownInput 
                label='Направление ИУ'
                items={[{label: 'Направление 1', value: '0'}, {label: 'Направление 2', value: '1'}]}
                value={exdevDirNumber}
                onChange={setExdevDirNumber}
            />
            {selectedValue==='acm' && (
                <DropdownInput 
                    label='Выбор РКД'
                    items={[{label: 'РКД Открыто', value: 'open'}, {label: 'РКД Контроль', value: 'control'}]}
                    value={accessModeValue}
                    onChange={setAccessModeValue}
                />
            )}
            {selectedValue==='exdev' && (
                <>
                    <DropdownInput 
                        label='Тип команды'
                        items={[{label: 'Открыть ИУ', value: 'open'}, {label: 'Заблокировать ИУ', value: 'close'}]}
                        value={exdevActionValue}
                        onChange={setExdevActionValue}
                    />
                    {openType==='open once' && <InputField 
                        label='Время разблокировки(мс)'
                        value={exdevUnlockTime}
                        placeholder="В миллисекундах"
                        onChangeText={setExdevUnlockTime}
                        keyboardType="numeric"
                    />}
                    <DropdownInput 
                        label='Тип разблокировки'
                        items={[{label: 'Однократный проход', value: 'open once'}, {label: 'Однокр, бесконечное ожидание', value: 'open oncealways'}]}
                        value={openType}
                        onChange={setOpenType}
                    />
                </>
            )}
            <Button title='Отправить' onPress={executeCommand} size='M'/>
            <ErrorModal
                visible={isErrorModalVisible}
                message={errorMessage}
                onClose={() => setIsErrorModalVisible(false)}
            />
            <ModalText
                title={''} 
                message={resultMessage}
                visible={isModalVisible}
                onClose={()=> setIsModalVisible(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    }
})