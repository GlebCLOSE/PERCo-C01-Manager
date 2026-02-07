import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export interface PadLineProps {
    name: string,
    type: string,
    onPress: () => void
}

export const PadLine: React.FC<PadLineProps> = ({ name = 'in1', type = 'Сигнал прохода', onPress}) => {

    let padName = 'Тип входа'
    let lineStyle: Array<object> = [styles.container]
    let textStyle: Array<object> = [styles.text]

    switch(type){
        case 'pass':
            padName = 'Сигнал прохода'
            lineStyle = [styles.container, styles.containerYellow] 
            textStyle = [styles.text, styles.textYellow]
        break
        case 'remote control input':
            padName='Кнопка ПДУ'
            lineStyle = [styles.container, styles.containerGreen]
            textStyle = [styles.text, styles.textGreen] 
        break
        case 'input':
            padName='Вход обычный'
            lineStyle = [styles.container] 
            textStyle = [styles.text]
        break
        case 'fire alarm input':
            padName='Вход пожарной тревоги'
            lineStyle = [styles.container, styles.containerRed]
            textStyle = [styles.text, styles.textRed] 
        break
        case 'output':
            padName='Выход обычный'
            lineStyle = [styles.container, styles.containerOrange]
            textStyle = [styles.text, styles.textOrange] 
        break
        case 'exdev output':
            padName='Выход управления ИУ'
            lineStyle = [styles.container, styles.containerOrange]
            textStyle = [styles.text, styles.textOrange] 
        break
        case 'remote control output':
            padName='Выход управления ИУ'
            lineStyle = [styles.container, styles.containerLime]
            textStyle = [styles.text, styles.textLime] 
        break                  

    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
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
    textYellow: {
        color: '#ab7500c0'
    },
    containerGreen: {
        borderColor: '#254426a6',
        backgroundColor: '#a3eca7a8'
    },
    textGreen: {
        color: '#254426c2'
    },
    containerOrange: {
        borderColor: '#ab7500c0',
        backgroundColor: '#ffcd82ad'
    },
    textOrange: {
        color: '#ab7500da'
    },
    containerRed: {
        borderColor: '#a70707bd',
        backgroundColor: '#ff3f3f8e'
    },
    textRed: {
        color: '#7c0707d2'
    },
    containerBlue: {
        borderColor: '#32117Ac0',
        backgroundColor: '#82DCFF9d'
    },
    textBlue: {
        color: '#32117Ac0'
    },
    containerLime: {
        borderColor: '#457A11c0',
        backgroundColor: '#85f1a7ab'
    },
    textLime: {
        color: '#457A11c0'
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