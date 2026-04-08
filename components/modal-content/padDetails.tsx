import { View, Text, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
import DropdownInput from "../ui/elements/input/DropdownInput"
import { mapPadNames, mapPadTypes } from "../../types/maps"
import { PadParams, useControllerConfig } from "../../hooks/useControllerConfig"
import ModalText from "../ui/status/ModalText"

interface PadDetailsProps {
    data: PadParams
}

export const PadDetails: React.FC<PadDetailsProps> = ({data}) => {
    console.log(data)

    const { setPadConfig } = useControllerConfig()

    const [padType, setPadType] = useState<PadParams["function"]>(data["function"])
    const [padResource, setPadResource] = useState<PadParams["resource_number"]>(data["resource_number"])
    const [padDirection, setPadDirection] = useState<PadParams["resource_direction"]>(data["resource_direction"])
    const [normalState, setNormalState] = useState<PadParams["normal_state"]>(data["normal_state"])
    const [debounce, setDebounce] = useState<string>(String(data["debounce"] ?? ''))
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        setPadType(data.function);
        setPadResource(data.resource_number);
        setPadDirection(data.resource_direction);
        setNormalState(data.normal_state);
        setDebounce(String(data.debounce ?? ''));
    }, [data]);

    const getDropdownItems = (number: number) => {
        if (number >= 0 && number <= 7) {
            return [
            { label: 'Разомкнут', value: 'break' },
            { label: 'Замкнут', value: 'short' }
            ];
        } else if (number >= 8 && number <= 15) {
            return [
            { label: 'Запитан', value: 'powered' },
            { label: 'Не запитан', value: 'not powered' }
            ];
        }
        return []; 
    };

       
    const dropdownItems = getDropdownItems(data["number"] ?? 0);

    const padTypeList = Array.from(mapPadTypes, ([value, label]) => ({ value, label }))

    const handleSetPadSettings = async () => {
        const payload: PadParams = {
            number: data["number"],
            function: padType,
            resource_number: padResource,
            resource_direction: padDirection,
            normal_state: normalState,
            debounce: Number(debounce) || 20
        }

        try {
            const result: any = await setPadConfig(payload);
            const isOk = result?.answer?.pad === 'ok';
            setResultMessage(isOk ? 'Конфигурация успешно установлена' : 'Ошибка при передаче данных');
            } catch (e) {
            setResultMessage('Сетевая ошибка');
            }
        setIsModalVisible(true);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>{mapPadNames.get(data["number"] ?? 0)}</Text>
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
                items={dropdownItems}
                value={normalState}
                onChange={setNormalState}
                size='s'
            />
            <InputField 
                label='Антидребезг(мс)'
                size='s'
                placeholder='100 мс'
                value={debounce}
                onChangeText={setDebounce}
            />         
            <Button 
                title='Сохранить'
                onPress={()=>handleSetPadSettings()}
                size="M"
            />
            <ModalText
                title={'Ответ'} 
                message={resultMessage}
                visible={isModalVisible}
                onClose={()=> setIsModalVisible(false)}
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