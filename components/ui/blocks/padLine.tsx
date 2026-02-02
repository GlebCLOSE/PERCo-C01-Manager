import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export interface PadLineProps {
    name: string,
    type: string
}

export const PadLine: React.FC<PadLineProps> = ({ name = 'in1', type = 'Сигнал прохода'}) => {

    let padName = 'Тип входа'
    switch(type){
        case 'pass':
            padName='Сигнал прохода'
        break
        case 'remote control input':
            padName='Кнопка ПДУ'
        break
        case 'input':
            padName='Вход обычный'
        break
        case 'fire alarm input':
            padName='Вход пожарной тревоги'
        break
        case 'output':
            padName='Вход пожарной тревоги'
        break        

    }

    return (
        <TouchableOpacity style={styles.container}>
            <Text style={[ styles.text, styles.textBold ]}>{name}</Text>
            <Text style={styles.text}>{type}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#adc4ff31',
        borderWidth: 1,
        borderColor: '#00047060',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        gap: 20,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25), inset -3px -3px 15px rgba(0, 0, 0, 0.25)'
    },
    containerYellow: {
        borderColor: '#ab7500c0',
        backgroundColor: '#fff7b29d'
    },
    containerGreen: {
        borderColor: '#254426a6',
        backgroundColor: '#a3eca7a8'
    },
    containerOrange: {
        borderColor: '#ab7500c0',
        backgroundColor: '#ffcd82ad'
    },
    containerBlue: {
        borderColor: '#32117Ac0',
        backgroundColor: '#82DCFF9d'
    },
    containerLime: {
        borderColor: '#457A11c0',
        backgroundColor: '#85f1a7ab'
    },
    text: {
        color: '#000670a8',
        fontSize: 14,
        fontWeight: '400'
    },
    textBold: {
        fontWeight: '800'
    },

})