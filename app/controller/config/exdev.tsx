import { Text, StyleSheet, View, FlatList } from "react-native";
import { ButtonSquare } from "../../../components/ui/elements/buttons/buttonSquare";
import { ExdevLine } from "../../../components/ui/blocks/exdevLine";
import { useState } from 'react'
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { ExdevDetails } from "../../../components/modal-content/exdevDetails";

export default function ExdevScreen() {

    const [activeExdev, setActiveExdev] = useState('')

    const arrayExdevs: Array<Object> = [
        {
            number: 0,
            type: 'lock'
        },
        {
            number: 1,
            type: 'lock'
        }
    ]

    function closeModal(){
        setActiveExdev('')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Исполнительные устройства</Text>
            <View style={{gap: 5}}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <FlatList
                    data={arrayExdevs}
                    renderItem={({item})=><ExdevLine number={item.number} type={item.type}  onPress={()=>{setActiveReader(item)}}/>}
                /> 
            </View>
            <ModalChildren title={'Исполнительное устройство'} visible={activeExdev !== ''} onClose={closeModal}>
                <ExdevDetails data={activeExdev}/>
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