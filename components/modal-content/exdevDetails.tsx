import { View, Text, StyleSheet } from "react-native"
import { useState } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
import DropdownInput from "../ui/elements/input/DropdownInput"
import Checkbox from "expo-checkbox"
import { ExdevParams } from "../../hooks/useControllerConfig"

interface ExdevDetailsProps {
    data: ExdevParams
}

export const ExdevDetails: React.FC<ExdevDetailsProps> = ({data}) => {

    const [exdevType, setExdevType] = useState(data["type"])
    const [optMode, setOptMode] = useState(data["opt_mode"])
    const [optNorm, setOptNorm] = useState(data["opt_norm"])
    const [exdevOptFix, setExdevOptFix] = useState(data["opt_fix"])
    const [analysisTime, setAnalisysTime] = useState(data["analysis _time"])
    const [unlockTime, setUnlockTime] = useState(data["analysis _time"])
    const [isChecked, setChecked] = useState(false)

    const exdevTypeList = [
        {label: 'Односторонний замок', value: 'lock'},
        {label: 'Двухсторонний замок', value: 'double lock'},
        {label: 'Турникет', value: 'turnstyle'},
        {label: 'Шлагбаум', value: 'gate'},
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>ИУ №{data["number"] + 1}</Text>
            <View style={styles.hr}></View>
            <DropdownInput 
                label='Тип ИУ'
                items={exdevTypeList}
                value={exdevType}
                onChange={setExdevType}
                size='s'
            />
            <DropdownInput 
                label='Режим управления'
                items={[{label: 'Потенциальный', value: "potencial"}, {label: 'Импульсный', value: "pulse"}]}
                value={optMode}
                onChange={setOptMode}
                size='s'
            />
            <View style={styles.horizontalBlock}>
                <InputField 
                    label='Время анализа ID'
                    size='s'
                    placeholder="1000 мс"
                    value={analysisTime}
                    onChangeText={setAnalisysTime}
                />
                <InputField 
                    label='Время разблокировки'
                    size='s'
                    placeholder="1000 мс"
                    value={unlockTime}
                    onChangeText={setUnlockTime}
                />           
            </View>
            <DropdownInput 
                label='Нормализация выхода управления'
                items={[{label: 'После закрытия', value: "afterclosed"}, {label: 'После открытия', value: "afteropened"}]}
                value={optMode}
                onChange={setOptMode}
                size='s'
            />
            <View style={styles.horizontalBlock}>
                <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#4630EB' : undefined}
                />
                <Text style={styles.smallText}>Регистрация прохода по предъявлению ID</Text>
            </View>
            <Button 
                title='Сохранить'
                onPress={()=>{}}
                size="M"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        width: '100%',
        gap: 7 
    },
    smallText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: '#000670',
        fontWeight: '300'
    },
    bold: {
        fontWeight: '800'
    },
    hr: {
        height: 1,
        backgroundColor: '#000670'
    },
    horizontalBlock: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})