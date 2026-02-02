import { Text, View, StyleSheet } from "react-native";
import { ReaderLine } from "../../../components/ui/blocks/readerLine";
import { ButtonSquare } from "../../../components/ui/elements/buttons/buttonSquare";

export default function ReadersScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Считыватели</Text>
            <View style={{gap: 5}}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <ReaderLine />
                <ReaderLine />
                <ReaderLine />
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