import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { mapPadNames, mapPadTypes } from "../../../types/maps"
import { semanticLineColors as c } from "../../../constants/theme"

export interface PadLineProps {
    number: number,
    type: string,
    onPress: () => void
}

export const PadLine: React.FC<PadLineProps> = ({ number = 0, type = 'Сигнал прохода', onPress}) => {


    const name = mapPadNames.get(number)
    const padName = mapPadTypes.get(type)

    let lineStyle: Array<object> = [styles.container]
    let textStyle: Array<object> = [styles.text]

    switch(type){
        case 'pass':
            lineStyle = [styles.container, styles.containerYellow] 
            textStyle = [styles.text, styles.textYellow]
        break
        case 'remote control input':
            lineStyle = [styles.container, styles.containerGreen]
            textStyle = [styles.text, styles.textGreen] 
        break
        case 'input':
            lineStyle = [styles.container] 
            textStyle = [styles.text]
        break
        case 'fire alarm input':
            lineStyle = [styles.container, styles.containerRed]
            textStyle = [styles.text, styles.textRed] 
        break
        case 'output':
            lineStyle = [styles.container, styles.containerOrange]
            textStyle = [styles.text, styles.textOrange] 
        break
        case 'exdev output':
            lineStyle = [styles.container, styles.containerOrange]
            textStyle = [styles.text, styles.textOrange] 
        break
        case 'remote control output':
            lineStyle = [styles.container, styles.containerLime]
            textStyle = [styles.text, styles.textLime] 
        break                  

    }

    return (
        <TouchableOpacity style={lineStyle} onPress={onPress}>
            <Text style={[ textStyle, styles.textBold ]}>{name}</Text>
            <Text style={textStyle}>{padName}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: c.padDefaultBg,
        borderWidth: 1,
        borderColor: c.padDefaultBorder,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        gap: 20,
        boxShadow: c.padDefaultShadow,
    },
    containerYellow: {
        borderColor: c.yellowBorder,
        backgroundColor: c.yellowBg,
    },
    textYellow: {
        color: c.yellowText,
    },
    containerGreen: {
        borderColor: c.greenBorder,
        backgroundColor: c.greenBg,
    },
    textGreen: {
        color: c.greenText,
    },
    containerOrange: {
        borderColor: c.orangeBorder,
        backgroundColor: c.orangeBg,
    },
    textOrange: {
        color: c.orangeText,
    },
    containerRed: {
        borderColor: c.redBorder,
        backgroundColor: c.redBg,
    },
    textRed: {
        color: c.redText,
    },
    containerBlue: {
        borderColor: c.blueBorder,
        backgroundColor: c.blueBg,
    },
    textBlue: {
        color: c.blueText,
    },
    containerLime: {
        borderColor: c.limeBorder,
        backgroundColor: c.limeBg,
    },
    textLime: {
        color: c.limeText,
    },
    text: {
        color: c.defaultTextMuted,
        fontSize: 14,
        fontWeight: '400'
    },
    textBold: {
        fontWeight: '800'
    },

})