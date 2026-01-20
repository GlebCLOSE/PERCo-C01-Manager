import { View, Text, StyleSheet } from "react-native"

export const SmallStateBlock = () => {
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.textDark}>{title}</Text>
            </View>
            <View style={styles.bottom}>
                <Text style={styles.textLight}>{value}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffffa1',
        borderWidth: 1,
        borderColor: '#00047060',
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    top: { 
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textDark: {
        color: '#000670d2',
        fontSize: 10,
        fontWeight: '200'
    },
    textLight: {
        color: '#ffffffd3',
        fontSize: 10,
        fontWeight: '600'
    }
})