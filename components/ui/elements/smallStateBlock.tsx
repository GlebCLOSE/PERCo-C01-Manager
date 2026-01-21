import { View, Text, StyleSheet } from "react-native"

export interface SmallStateBlockProps {
   title: string,
   value: string,
   bottomBlockStyle: object 
}

export const SmallStateBlock: React.FC<SmallStateBlockProps> = ({ title, value, bottomBlockStyle }) => {
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.textDark}>{title}</Text>
            </View>
            <View style={[styles.bottom, bottomBlockStyle]}>
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
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 5
    },
    top: { 
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
    },
    bottom: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        width: '100%'
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