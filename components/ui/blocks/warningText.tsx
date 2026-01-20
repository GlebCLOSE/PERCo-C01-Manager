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
        padding: 15,
        backgroundColor: '#ff741049',
        borderWidth: 1,
        borderColor: '#934107c9',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'inter',
        fontWeight: '300',
        fontSize: 20,
    }
})