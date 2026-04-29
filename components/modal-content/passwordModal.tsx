import { View, Text, StyleSheet } from "react-native"
import { useState, useMemo } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
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

export const PasswordModal = () => {
    const [password, setPassword] = useState('')
    const [passwordС, setPasswordС] = useState('')
    const { palette } = useTheme()
    const styles = useMemo(() => createStyles(palette), [palette])

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>Укажите IP-адрес сервера, для настройки обратного подключения от контроллера к серверу.</Text>
            <View style={styles.hr}></View>
            <InputField
                label='Новый пароль'
                size='s'
                secureTextEntry={true}
                placeholder="0000"
                value={password}
                onChangeText={setPassword}
            />
            <InputField
                label='Повторить пароль'
                size='s'
                secureTextEntry={true}
                placeholder="0000"
                value={passwordС}
                onChangeText={setPasswordС}
            />
            <Button
                title='Сохранить'
                onPress={() => { }}
                size="M"
            />
        </View>
    )
}
