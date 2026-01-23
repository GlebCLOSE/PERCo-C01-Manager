import { Text, View, StyleSheet } from "react-native";
import { ExdevState } from "../../components/ui/blocks/exdevState";
import { StateField } from "../../components/ui/elements/stateField";
import { useState } from "react";
import { useControllerCommands } from "../../hooks/useControllerCommands";

export default function StateScreen() {

    const [type, setType] = useState('')
    const [acm, setAcm] = useState('')
    const [status, setStatus] = useState('')
    const [pass, setPass] = useState('')

    const [top, setTop] = useState('')
    const [ipMode, setIpMode] = useState('')
    const [voltage, setVoltage] = useState('')
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { getState } = useControllerCommands()

    const handleGetState = async () => {
        try {
            const data = await getState()
        } catch (error) {
            // Обработка сетевых ошибок и других исключений
            setErrorMessage('Произошла непредвиденная ошибка при подключении');
            setIsErrorModalVisible(true);
        }
    }
    

    return (
        <>
            <View style={styles.title}>
                <Text style={styles.textL}>Состояние</Text>
                {/* Кнопка обновления состояния */}
            </View>
            <View style={styles.block}>
                <Text style={styles.textM}>Исполнительные устройства</Text>
                <ExdevState 
                    number={0}
                    type={'lock'}
                    acm={'control'}
                    status={'locked'}
                    pass={'normal'}
                />
                <ExdevState 
                    number={1}
                    type={'lock'}
                    acm={'open'}
                    status={'unlocked'}
                    pass={'active'}
                />
            </View>
            <View style={styles.block}>
                <Text style={styles.textM}>Контроллер</Text>
                <StateField 
                    title={'Верхняя крышка'}
                    value={'Закрыта'}
                />
                <StateField 
                    title={'Режим XP1'}
                    value={'Пользовательский'}
                />
                <StateField 
                    title={'Напряжение'}
                    value={'12,5 В'}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    block: {
        width: '100%',
        gap: 10,
        flexDirection: 'column'
    },
    textL: {
        fontSize: 24,
        fontFamily: 'inter',
        fontWeight: '300'
    },
    textM: {
        fontSize: 16,
        fontFamily: 'inter',
        fontWeight: '300'
    }
})