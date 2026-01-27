import { Text, View, StyleSheet } from "react-native";
import { ExdevState } from "../../components/ui/blocks/exdevState";
import { StateField } from "../../components/ui/elements/stateField";
import { useState } from "react";
import { useControllerCommands } from "../../hooks/useControllerCommands";
import ErrorModal from "../../components/ui/status/ErrorModal";
import { Button } from "../../components/ui/elements/buttons/Button";

export default function StateScreen() {

    const [type, setType] = useState('')
    const [acm, setAcm] = useState('')
    const [status, setStatus] = useState('')
    const [pass, setPass] = useState('')
    const [exdevs, setExdevs] = useState([{"number": 1, "type": "turnstyle", "physical_state" : ["",""], "unlock_state" : ["",""], "access_mode" : ["",""]}, {"number": 2, "type": "turnstyle", "physical_state" : ["",""], "unlock_state" : ["",""], "access_mode" : ["",""]}])

    const [coverOn, setCoverOn] = useState('нет данных')
    const [ipMode, setIpMode] = useState('нет данных')
    const [voltage, setVoltage] = useState('нет данных')
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [stateData, setStateData] = useState({})

    const { getState, getExdevInfo } = useControllerCommands()

const handleGetState = async () => {
    try {
        // 1. Получаем данные от
        const data: any = await getState(); 

        if (data.answer?.state === 'ok') {
            const state = data.state;
            
            alert('Данные о состоянии получены успешно');
            
            const exdevArray: any[] = [{},{}]

            for (let i = 0; i < 2; i++) {
                // 2. Получаем данные номера и типа исполнительного устройства
                const exdevInfo: any = await getExdevInfo(i);
                
                exdevArray[i].number = i;
                // 3. Теперь обращение к ['type'] будет работать
                exdevArray[i].type = exdevInfo.exdev['type'];
                
                
                // Проверьте, что state.exdev[i] существует, прежде чем брать индексы [0]
                exdevArray[i].acm = state.exdev[i]['access_state']?.[0];
                exdevArray[i].status = state.exdev[i]['unlock_state']?.[0];
                exdevArray[i].pass = state.exdev[i]['physical_state']?.[0];
            }

            setExdevs(exdevArray);

            // Общие параметры контроллера
            setCoverOn(state['cover_on'] ? 'Открыта' : 'Закрыта');

            // Логика IP Mode
            if (state['ip_mode'] === true) {
                setIpMode('DHCP Mode');
            } else if (state['ip_default'] === true) {
                setIpMode('IP Default');
            } else {
                setIpMode('Пользовательский режим');
            }

            setVoltage((state['value_suply'] / 1000) + ' В');
        }
    } catch (error) {
        console.error(error); 
        setErrorMessage('Произошла непредвиденная ошибка при получении данных');
        setIsErrorModalVisible(true);
    }
};

    const exdevStates = exdevs.map((el)=>{ 
        return (
        <ExdevState
            key={el.number}
            number={el.number} 
            type={el.type} 
            acm={el.acm} 
            status={el.status} 
            pass={el.pass} 
         />
        )
    })

    return (
        <>
            <View style={styles.title}>
                <Text style={styles.textL}>Состояние</Text>
                <Button title='Обновить' onPress={handleGetState} size='S'/>
            </View>
            <View style={styles.block}>
                <Text style={styles.textM}>Исполнительные устройства</Text>
                {exdevStates}
            </View>
            <View style={styles.block}>
                <Text style={styles.textM}>Контроллер</Text>
                <StateField 
                    title={'Верхняя крышка'}
                    value={coverOn}
                />
                <StateField 
                    title={'Режим XP1'}
                    value={ipMode}
                />
                <StateField 
                    title={'Напряжение'}
                    value={voltage}
                />
                <ErrorModal
                    visible={isErrorModalVisible}
                    message={errorMessage}
                    onClose={() => setIsErrorModalVisible(false)}
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