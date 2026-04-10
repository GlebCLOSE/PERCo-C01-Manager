import { Button, ScrollView, Text, View, StyleSheet } from "react-native";
import { EventLine } from "../../components/ui/blocks/eventLine";

export default function EventsScreen() {
    return (
        <>
            <View style={styles.title}>
                <Text style={styles.textTitle}>События</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                <EventLine event={{event: 'card', card: {number: 0, direction: 0, id: '1234567890', remove_card: false}}} />
                <EventLine event={{event: 'pass_personal', pass_personal: {number: 0, direction: 0, id: '1234567890', remove_card: false}}} />
                <EventLine event={{event: 'pass_impersonal', pass_impersonal: {number: 0, direction: 0, command_source: 'server'}}} />
                <EventLine event={{event: 'refusal_personal', refusal_personal: {number: 0, direction: 0, id: '1234567890', remove_card: false}}} />
                <EventLine event={{event: 'refusal_impersonal', refusal_impersonal: {number: 0, direction: 0, command_source: 'server'}}} />
                <EventLine event={{event: 'pass_ban_personal', pass_ban_personal: {number: 0, direction: 0, id: '1234567890', remove_card: false, command_source: 'server'}}} />
                <EventLine event={{event: 'pass_ban_impersonal', pass_ban_impersonal: {number: 0, direction: 0, command_source: 'server'}}} />
                <EventLine event={{event: 'break', break: {number: 0, direction: 0}}} />
                <EventLine event={{event: 'exdev_long_open', exdev_long_open: {number: 0, direction: 0}}} />
                <EventLine event={{event: 'exdev_unlock', exdev_unlock: {number: 0, direction: 0, unlock: true}}} />
                <EventLine event={{event: 'input', input: {number: 0, on: true, function: 'input'}}} />
                <EventLine event={{event: 'output', output: {number: 0, on: true, function: 'output'}}} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    textTitle: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    },
    container: {
        gap: 20,    
    },
})