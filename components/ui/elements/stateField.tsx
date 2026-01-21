import { View, Text, StyleSheet } from "react-native"

export interface StateFieldProps {
    title: string,
    value: string
}

export const StateField = ({ title, value }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.textDark}>{title}</Text>
            <Text style={styles.textLight}>{value}</Text>
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
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5
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