import { View, Text, StyleSheet } from "react-native"
import { useState } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"

export const PasswordModal = () => {

    const [password, setPassword] = useState('')
    const [passwordС, setPasswordС] = useState('')

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
                onPress={()=>{}}
                size="M"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        width: '100%',
        gap: 7 
    },
    smallText: {
        fontFamily: 'inter',
        fontSize: 12,
        color: '#000670',
        fontWeight: '300'
    },
    bold: {
        fontWeight: '800'
    },
    hr: {
        height: 1,
        backgroundColor: '#000670'
    }
})