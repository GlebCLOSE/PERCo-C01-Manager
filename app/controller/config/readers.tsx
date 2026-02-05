import { Text, View, StyleSheet, FlatList } from "react-native";
import { ReaderLine } from "../../../components/ui/blocks/readerLine";
import { ButtonSquare } from "../../../components/ui/elements/buttons/buttonSquare";
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { ReaderDetails } from "../../../components/modal-content/readerDetails";
import { useState } from "react";

export default function ReadersScreen() {

    const [activeReader, setActiveReader] = useState('');
    const arrayReaders = [
        {
            "number" : 0,
            "type" : "Wiegand",
            "port" : 0,
            "exdev_number" : 0,
            "exdev_direction" : 0
        },
        {
            "number" : 1,
            "type" : "Barcode",
            "port" : 1,
            "exdev_number" : 0,
            "exdev_direction" : 1
        },
        {
            "number" : 2,
            "type" : "Barcode",
            "port" : 2,
            "exdev_number" : 0,
            "exdev_direction" : 1
        },
    ]

    const closeModal = () => {
        setActiveReader('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Считыватели</Text>
            <View style={{gap: 5}}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <FlatList
                    data={arrayReaders}
                    renderItem={({item})=><ReaderLine number={item.number} type={item.type} exdevNumber={item["exdev_number"]} exdevDirNumber={item["exdev_direction"]} onPress={()=>{setActiveReader(item)}}/>}
                /> 
            </View>
            <ModalChildren title={'Считыватель'} visible={activeReader !== ''} onClose={closeModal}>
                <ReaderDetails data={activeReader}/>
            </ModalChildren>
            <ButtonSquare title='Добавить считыватель' onPress={()=>{}} icon={require('../../../assets/icons/addReader.png')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        justifyContent: 'flex-start'
    },
    title: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    },
    subtitle: {
        fontFamily: 'inter',
        fontSize: 16,
        fontWeight: '400',
        color: '#1A2253'
    },
    blockButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})