import { Text, StyleSheet, ScrollView, View } from "react-native";
import { WarningText } from "../../../components/ui/blocks/warningText";
import { PadLine } from "../../../components/ui/blocks/padLine";

export default function PadsScreen() {
    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                <Text style={styles.title}>Физические контакты</Text>
                <WarningText text="Необдуманные действия в этом разделе могут привести к некорректной работе контроллера"/>
                <View>
                    <PadLine />
                </View>
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