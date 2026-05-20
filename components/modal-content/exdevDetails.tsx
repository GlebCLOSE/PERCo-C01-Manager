import { View, Text, StyleSheet } from "react-native"
import { useState, useMemo } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
import DropdownInput from "../ui/elements/input/DropdownInput"
import Checkbox from "expo-checkbox"
import { ExdevParams, useControllerConfig } from "../../hooks/useControllerConfig"
import ModalText from "../ui/status/ModalText"
import { useTheme } from "../../providers/ThemeContext"
import type { AppPalette } from "../../constants/theme"

interface ExdevDetailsProps {
    data: ExdevParams
}

function createStyles(p: AppPalette) {
    return StyleSheet.create({
        container: {
            width: '100%',
            gap: 7
        },
        smallText: {
            fontFamily: 'inter',
            fontSize: 12,
            color: p.modalFormInk,
            fontWeight: '300'
        },
        hr: {
            height: 1,
            backgroundColor: p.modalFormRule
        },
        horizontalBlock: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    })
}

export const ExdevDetails: React.FC<ExdevDetailsProps> = ({ data }) => {

    const { setExdevConfig } = useControllerConfig()
    const { palette } = useTheme()
    const styles = useMemo(() => createStyles(palette), [palette])

    const [exdevType, setExdevType] = useState(data["type"])
    const [optMode, setOptMode] = useState(data["opt_mode"])
    const [optNorm, setOptNorm] = useState(data["opt_norm"])
    const [exdevOptFix, setExdevOptFix] = useState(data["opt_fix"])
    const [analysisTime, setAnalisysTime] = useState(data["analysis_time"])
    const [unlockTime, setUnlockTime] = useState(data["analysis_time"])
    const [isChecked, setChecked] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    const exdevTypeList = [
        { label: 'Односторонний замок', value: 'lock' },
        { label: 'Двухсторонний замок', value: 'double lock' },
        { label: 'Турникет', value: 'turnstyle' },
        { label: 'Шлагбаум', value: 'gate' },
    ]

    const numberHandler = (setter: (v: string) => void) => (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setter(cleaned);
    };

    const handleSetExdevParams = async () => {
        try {
            const payload: ExdevParams = {
                'number': data['number'],
                "type": exdevType,
                "opt_fix": exdevOptFix,
                "analysis_time": Number(analysisTime || 0),
                "unblock_time": Number(unlockTime || 0),
                "opt_mode": optMode,
                "opt_norm": optNorm
            }

            const result = await setExdevConfig(payload)
            if (result?.answer?.exdev === 'ok') {
                setResultMessage('Конфигурация успешно установлена')
                setIsModalVisible(true)
            } else {
                setResultMessage('Ошибка при передаче данных')
                setIsModalVisible(true)
            }
        } catch {
            setResultMessage('Сетевая ошибка')
            setIsModalVisible(true)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>ИУ №{data["number"] !== undefined ? data["number"]! + 1 : ''}</Text>
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
                items={[{ label: 'Потенциальный', value: "potencial" }, { label: 'Импульсный', value: "pulse" }]}
                value={optMode}
                onChange={setOptMode}
                size='s'
            />
            <View style={styles.horizontalBlock}>
                <InputField
                    label='Время анализа ID'
                    size='s'
                    placeholder="1000 мс"
                    value={analysisTime ? analysisTime.toString() : ''}
                    onChangeText={numberHandler(setAnalisysTime)}
                    keyboardType="number-pad"
                />
                <InputField
                    label='Время разблокировки'
                    size='s'
                    placeholder="1000 мс"
                    value={unlockTime ? unlockTime.toString() : ''}
                    onChangeText={numberHandler(setUnlockTime)}
                    keyboardType="number-pad"
                />
            </View>
            <DropdownInput
                label='Нормализация выхода управления'
                items={[{ label: 'После закрытия', value: "afterclosed" }, { label: 'После открытия', value: "afteropened" }]}
                value={optNorm}
                onChange={setOptNorm}
                size='s'
            />
            <View style={styles.horizontalBlock}>
                <Checkbox
                    value={isChecked}
                    onValueChange={(newValue) => { setChecked(newValue); newValue ? setExdevOptFix("card") : setExdevOptFix("pass") }}
                    color={isChecked ? palette.checkboxChecked : undefined}
                />
                <Text style={styles.smallText}>Регистрация прохода по предъявлению ID</Text>
            </View>
            <ModalText
                title={'Ответ'}
                message={resultMessage}
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
            <Button
                title='Сохранить'
                onPress={handleSetExdevParams}
                size="S"
            />
        </View>
    )
}
