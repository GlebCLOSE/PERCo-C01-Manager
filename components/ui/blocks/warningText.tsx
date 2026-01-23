import { Text, View, StyleSheet } from 'react-native'

export const WarningText = ({text}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ff741049',
        borderWidth: 1,
        borderColor: '#934107c9',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'inter',
        fontWeight: '200',
        fontSize: 16,
    }
})