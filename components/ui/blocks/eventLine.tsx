import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { PercoEvent, shortEventLabel } from "../../../types/events"
import { semanticLineColors as c } from "../../../constants/theme"

type EventLineProps = {
    event: PercoEvent
    receivedAt: number
    onPress?: () => void
}

export const EventLine = ({ event, receivedAt, onPress }: EventLineProps) => {

    const shortTitle = shortEventLabel(event)
    const dt = new Date(receivedAt)
    const date = dt.toLocaleDateString()
    const time = dt.toLocaleTimeString()
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
            if (!event.exdev_unlock.unlock) {
                lineStyle = [styles.container, styles.containerYellow]
                textStyle = [styles.text, styles.textYellow]
            } else {
                lineStyle = [styles.container, styles.containerGreen]
                textStyle = [styles.text, styles.textGreen]
            }
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

    const content = (
        <>
            <View style={styles.date}>
                <Text style={styles.textDate}>{date}</Text>
                <Text style={styles.textDate}>{time}</Text>
            </View>
            <Text style={textStyle} numberOfLines={2}>{shortTitle}</Text>
        </>
    )

    if (onPress) {
        return (
            <TouchableOpacity
              style={lineStyle}
              onPress={onPress}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityHint="Показать подробности события"
            >
                {content}
            </TouchableOpacity>
        )
    }

    return (
        <View style={lineStyle}>
            {content}
        </View>
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
    date: {
        flexDirection: 'column',
        gap: 2,
    },
    text: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: c.defaultTextMuted,
    },
    textDate: {
        fontSize: 10,
        fontWeight: 'light',
        color: c.defaultTextMuted,
    },
})
