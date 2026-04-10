import { View, Text, StyleSheet } from "react-native"
import { handleEvent, PercoEvent } from "../../../types/events"

export const EventLine = ({event}: {event: PercoEvent}) => {


    const name = handleEvent(event)
    const date = '2026-04-10'
    const time = '12:00:00'

    //Определение стилей в зависимости от типа события
    let lineStyle: Array<object> = [styles.container]
    let textStyle: Array<object> = [styles.text]
    switch(event.event){
        case 'card':
            lineStyle = [styles.container, styles.containerYellow]
            textStyle = [styles.text, styles.textYellow]
        break
        case 'pass_personal':
            lineStyle = [styles.container, styles.containerGreen]
            textStyle = [styles.text, styles.textGreen]
        break
        case 'pass_impersonal':
            lineStyle = [styles.container, styles.containerYellow]
            textStyle = [styles.text, styles.textYellow]
        break
        case 'refusal_personal':
            lineStyle = [styles.container, styles.containerRed]
            textStyle = [styles.text, styles.textRed]
        break
        case 'refusal_impersonal':
            lineStyle = [styles.container, styles.containerYellow]
            textStyle = [styles.text, styles.textYellow]
        break
        case 'pass_ban_personal':
            lineStyle = [styles.container, styles.containerGreen]
            textStyle = [styles.text, styles.textGreen]
        break
        case 'pass_ban_impersonal':
            lineStyle = [styles.container, styles.containerYellow]
            textStyle = [styles.text, styles.textYellow]
        break
        case 'break':
            lineStyle = [styles.container, styles.containerRed]
            textStyle = [styles.text, styles.textRed]
        break
        case 'exdev_long_open':
            lineStyle = [styles.container, styles.containerYellow]
            textStyle = [styles.text, styles.textYellow]
        break
        case 'exdev_unlock':
            lineStyle = [styles.container, styles.containerGreen]
            textStyle = [styles.text, styles.textGreen]
        break
        case 'input':
            lineStyle = [styles.container, styles.containerYellow]
            textStyle = [styles.text, styles.textYellow]
        break
        case 'output':
            lineStyle = [styles.container, styles.containerGreen]
            textStyle = [styles.text, styles.textGreen]
        break
    }

    return (
        <View style={lineStyle}>
            <View style={styles.date}>
                <Text style={styles.textDate}>{date}</Text>
                <Text style={styles.textDate}>{time}</Text>
            </View>
            <Text style={textStyle}>{name}</Text>
        </View>
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
    date: {
        flexDirection: 'column',
        gap: 2,
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textDate: {
        fontSize: 10,
        fontWeight: 'light',
    },
})