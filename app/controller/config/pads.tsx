import { Text, StyleSheet, ScrollView, View, FlatList } from "react-native";
import { WarningText } from "../../../components/ui/blocks/warningText";
import { PadLine } from "../../../components/ui/blocks/padLine";
import { PadDetails } from "../../../components/modal-content/padDetails";
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { useState } from "react";

export default function PadsScreen() {

    const padList = [
        {
            'number' : 0,
            'function' : 'pass',
            "resource_number" : 0,
            "resource_direction" : 0,
            "normal_state" : "short",
            "debounce" : 50
        },
        {
            'number' : 1,
            'function' : 'pass',
            "resource_number" : 1,
            "resource_direction" : 0,
            "normal_state" : "short",
            "debounce" : 50
        },
        {
            'number' : 2,
            'function' : 'input',
            "resource_number" : 0,
            "resource_direction" : 0,
            "normal_state" : "short",
            "debounce" : 50
        },
        {
            'number' : 3,
            'function' : 'input',
            "resource_number" : 0,
            "resource_direction" : 0,
            "normal_state" : "short",
            "debounce" : 50
        }
    ]
    const [activePad, setActivePad] = useState('');

    const closeModal = () => {
        setActivePad('')
    }

    const ItemSeparator = () => (
        <View style={{ height: 10, backgroundColor: 'transparent' }} /> // Adjust height for vertical gap
    );


    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                <Text style={styles.title}>Физические контакты</Text>
                <WarningText text="Необдуманные действия в этом разделе могут привести к некорректной работе контроллера"/>
                <View>
                    <FlatList
                        data={padList}
                        style={{gap: 10}}
                        renderItem={({item})=><PadLine number={item.number} type={item.function}  onPress={()=>{setActivePad(item)}}/>}
                        ItemSeparatorComponent={ItemSeparator}
                    /> 
                </View>
                <ModalChildren title={'Вход'} visible={activePad !== ''} onClose={closeModal}>
                    <PadDetails data={activePad}/>
                </ModalChildren>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    },
    blockButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})