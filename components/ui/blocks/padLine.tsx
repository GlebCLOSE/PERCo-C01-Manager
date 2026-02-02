import { View, Text, StyleSheet } from "react-native"

export interface PadLineProps {
    name: string,
    type: string
}

export const PadLine: React.FC<PadLineProps> = ({ name, type }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.textDark}>{name}</Text>
            <Text style={styles.textLight}>{type}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#adc4ff31',
        borderWidth: 1,
        borderColor: '#00047060',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 5,
        borderRadius: 5,
        gap: 15,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), inset -3px -3px 15px rgba(0, 0, 0, 0.25)'
    },
    textDark: {
        color: '#000670a8',
        fontSize: 10,
        fontWeight: '200'
    },
    textLight: {
        color: '#000670d2',
        fontSize: 10,
        fontWeight: '600'
    }
})