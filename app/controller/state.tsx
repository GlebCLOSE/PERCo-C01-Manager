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
            const data: Promise<Object> = await getState()

            if(data.answer.state === 'ok'){
                const state = data.state
                alert('Данные о состоянии получены успешно')

                //Параметры ИУ
                const exdevArray = state.exdev
                for(let i=0; i < exdevArray.length; i++){
                    const exdevInfo: Promise<Object> = await getExdevInfo(i)
                    exdevArray[i].number = i

                    // здесь должна быть функция по определению типа ИУ
                    exdevArray[i].type = exdevInfo['type']
                    // Обработка physical_state, access_mode и т.д. для каждого направления ИУ
                    exdevArray[i].acm 
                }
                setExdevs(exdevArray)
                

                //Общие параметры контроллера
                if(state['cover_on']){setCoverOn('Открыта')} 
                else { setCoverOn('Закрыта')}
                
                //определяем IP Mode
                if(state['ip_mode']===true){
                    setIpMode('DHCP Mode')
                }
                if(state['ip_default']===true){
                    setIpMode('IP Default')
                } else {
                    setIpMode('Пользовательский режим')
                }

                //Определяем напряжение 
                setVoltage((state['value_suply']/1000) + ' В')
            }
            

        } catch (error) {
            // Обработка сетевых ошибок и других исключений
            setErrorMessage('Произошла непредвиденная ошибка при получении данных от контроллера');
            setIsErrorModalVisible(true);
        }
    }

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