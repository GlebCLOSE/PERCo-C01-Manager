import { View, Text, StyleSheet } from "react-native"
import { useState, useMemo } from "react"
import { Button } from "../ui/elements/buttons/Button"
import IPAddressInput from "../ui/elements/input/IPAddressInput"
import { useTheme } from "../../providers/ThemeContext"
import type { AppPalette } from "../../constants/theme"

function createStyles(p: AppPalette) {
    return StyleSheet.create({
        container: {
            width: '100%',
            gap: 7
        },
        smallText: {
            fontFamily: 'inter',
            fontSize: 12,
            color: p.modalFormInk,
            fontWeight: '300'
        },
        hr: {
            height: 1,
            backgroundColor: p.modalFormRule
        }
    })
}

export const ServerModal = () => {
    const [serverIp, setServerIp] = useState('')
    const { palette } = useTheme()
    const styles = useMemo(() => createStyles(palette), [palette])

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Укажите IP-адрес сервера, для настройки обратного подключения от контроллера к серверу.</Text>
            <View style={styles.hr}></View>
            <IPAddressInput
                label='IP-адрес сервера'
                size='s'
                placeholder="192.168.1.1"
                value={serverIp}
                onChangeText={setServerIp}
            />
            <Button
                title='Сохранить'
                onPress={() => { }}
                size="M"
            />
        </View>
    )
}
