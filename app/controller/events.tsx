import { ScrollView, Text, View, StyleSheet } from "react-native";
import { EventLine } from "../../components/ui/blocks/eventLine";
import { useController } from "../../providers/ControllerContext";

export default function EventsScreen() {
    const { events, clearEvents } = useController();
    return (
        <>
            <View style={styles.title}>
                <Text style={styles.textTitle}>События</Text>
                <Text style={styles.clear} onPress={clearEvents}>Очистить</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                {events.slice().reverse().map((e, idx) => (
                    <EventLine key={`${e.receivedAt}-${idx}`} event={e.event} receivedAt={e.receivedAt} />
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textTitle: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    },
    clear: {
        fontFamily: 'inter',
        fontSize: 14,
        color: '#1A2253',
        textDecorationLine: 'underline'
    },
    container: {
        gap: 20,    
    },
})