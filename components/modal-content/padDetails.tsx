import { View, Text, StyleSheet } from "react-native"
import { useState } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
import DropdownInput from "../ui/elements/input/DropdownInput"
import { mapPadTypes } from "../../types/maps"

interface PadParams {
    "number" : 0 | 1,
    "function" : "input" | "remote control input" | "pass" | "fire alarm input" | "remove card input" | 'output' | 'exdev output' | 'remote card output' | 'fire alarm output' | 'remove card output',
    "resource" : 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    "resource_direction" : 0 | 1 | 2 | 3,
    "normal_state" : 'short' | 'break' | 'not powered' | 'powered',
    "debounce" : number
}

interface PadDetailsProps {
    data: PadParams
}

export const PadDetails: React.FC<PadDetailsProps> = ({data}) => {

    const [padType, setPadType] = useState(data["function"])
    const [padResource, setPadResource] = useState(data["resource"])
    const [padDirection, setPadDirection] = useState(data["resource_direction"])
    const [normalState, setNormalState] = useState(data["normal_state"])
    const [debounce, setDebounce] = useState(100)

    const padTypeList = Array.from(mapPadTypes, ([value, label]) => ({ value, label }))

    const label = 'вход'

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Вход/выход №{data["number"] + 1}</Text>
            <View style={styles.hr}></View>
            <DropdownInput 
                label='Тип физ. контакта'
                items={padTypeList}
                value={padType}
                onChange={setPadType}
                size='s'
            />
            <View style={styles.horizontalBlock}>
                <DropdownInput 
                    label='Ресурс'
                    items={[{label: '1', value: 0}, {label: '2', value: 1}, {label: '3', value: 2}, {label: '4', value: 3}, {label: '5', value: 4}, {label: '6', value: 5}, {label: '7', value: 6}, {label: '8', value: 7} ]}
                    value={padResource}
                    onChange={setPadResource}
                    size='s'
                />
                <DropdownInput 
                    label='Направление'
                    items={[{label: '1', value: 0}, {label: '2', value: 1}]}
                    value={padDirection}
                    onChange={setPadDirection}
                    size='s'
                />           
            </View>
            <DropdownInput 
                label='Нормальное состояние'
                items={[{label: '1', value: 0}, {label: '2', value: 1}]}
                value={normalState}
                onChange={setNormalState}
                size='s'
            />
            <InputField 
                label='Время разблокировки'
                size='s'
                placeholder='100 мс'
                value={debounce}
                onChangeText={setDebounce}
            />         
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