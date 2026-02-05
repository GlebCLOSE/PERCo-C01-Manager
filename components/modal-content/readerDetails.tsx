import { View, Text, StyleSheet } from "react-native"
import { useState } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
import DropdownInput from "../ui/elements/input/DropdownInput"

interface ReaderParams {
    "number" : 0 | 1,
    "type" : "Wiegand" | "Barcode" | "Barcode_terminator" | "Barcode-USB_terminator" | "Barcode-USB",
    "port" : 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    "exdev_number" : 0 | 1,
    "exdev_direction" : 0 | 1
}

interface ReaderDetailsProps {
    data: ReaderParams
}

export const ReaderDetails: React.FC<ReaderDetailsProps> = ({data}) => {

    const [readerType, setReaderType] = useState(data["type"])
    const [readerPort, setReaderPort] = useState(data["port"])
    const [exdevDirection, setExdevDirection] = useState(data["exdev_number"])
    const [exdevNumber, setExdevNumber] = useState(data["exdev_direction"])

    const readerTypeList = [
        {label: 'Wiegand', value: 'Wiegand'},
        {label: 'Сканер штрих-кода(RS-232)(без перевода строк)', value: 'Barcode'},
        {label: 'Сканер штрих-кода(USB)(без перевода строк)', value: 'Barcode-USB'},
        {label: 'Сканер штрих-кода(USB)', value: 'Barcode_terminator'},
        {label: 'Сканер штрих-кода(USB)', value: "Barcode-USB_terminator"}
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Считыватель №{data["number"] + 1}</Text>
            <View style={styles.hr}></View>
            <DropdownInput 
                label='Тип команды'
                items={readerTypeList}
                value={readerType}
                onChange={setReaderType}
            />
            <View style={styles.horizontalBlock}>
                <DropdownInput 
                    label='Порт'
                    items={[{label: '1', value: 0}, {label: '2', value: 1}, {label: '3', value: 2}, {label: '4', value: 3}, {label: '5', value: 4}, {label: '6', value: 5}, {label: '7', value: 6}, {label: '8', value: 7} ]}
                    value={readerPort}
                    onChange={setReaderPort}
                />
                <DropdownInput 
                    label='Номер ИУ'
                    items={[{label: '1', value: 0}, {label: '2', value: 1}]}
                    value={exdevNumber}
                    onChange={setExdevNumber}
                />
                <DropdownInput 
                    label='Направление'
                    items={[{label: '1', value: 0}, {label: '2', value: 1}]}
                    value={exdevDirection}
                    onChange={setExdevDirection}
                />                
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