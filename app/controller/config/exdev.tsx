import { Text, StyleSheet, View } from "react-native";
import { ButtonSquare } from "../../../components/ui/elements/buttons/buttonSquare";
import { ExdevLine } from "../../../components/ui/blocks/exdevLine";

export default function ExdevScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Исполнительные устройства</Text>
            <View style={{gap: 5}}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <ExdevLine />
                <ExdevLine />
                <ExdevLine />
            </View>
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