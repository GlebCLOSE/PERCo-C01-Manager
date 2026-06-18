import { View, Text, StyleSheet } from "react-native"
import { useState, useMemo } from "react"
import { Button } from "../ui/elements/buttons/Button"
import InputField from "../ui/elements/input/InputField"
import ModalText from "../ui/status/ModalText"
import { useTheme } from "../../providers/ThemeContext"
import { useController } from "../../providers/ControllerContext"
import { useControllerConfig } from "../../hooks/useControllerConfig"
import { validatePassword } from "../../utils/validation/validatePassword"
import { updateDevicePasswordByIp } from "../../storage/deviceStorage"
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
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [errors, setErrors] = useState<{ password?: string; passwordConfirm?: string }>({})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [resultMessage, setResultMessage] = useState('')

    const { palette } = useTheme()
    const styles = useMemo(() => createStyles(palette), [palette])

    const { updateSessionPassword, ipAddress } = useController()
    const { setNetworkSettings } = useControllerConfig()

    const validateForm = () => {
        const next: { password?: string; passwordConfirm?: string } = {}

        const passwordError = validatePassword(password)
        if (passwordError) next.password = passwordError

        if (password !== passwordConfirm) {
            next.passwordConfirm = 'Пароли не совпадают'
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSave = async () => {
        if (!validateForm()) return

        const newPassword = password.trim()

        try {
            const result = await setNetworkSettings({ password: newPassword })
            if (result?.answer?.net === 'ok') {
                updateSessionPassword(newPassword)
                if (ipAddress) {
                    await updateDevicePasswordByIp(ipAddress, newPassword)
                }
                setPassword('')
                setPasswordConfirm('')
                setErrors({})
                setResultMessage('Пароль успешно установлен')
            } else {
                setResultMessage('Ошибка при передаче данных')
            }
            setIsModalVisible(true)
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Сетевая ошибка'
            setResultMessage(message)
            setIsModalVisible(true)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.smallText}>
                Укажите новый пароль доступа к контроллеру. Для снятия пароля оставьте поля пустыми.
            </Text>
            <View style={styles.hr}></View>
            <InputField
                label='Новый пароль'
                size='s'
                secureTextEntry={true}
                placeholder="0000"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
            />
            <InputField
                label='Повторить пароль'
                size='s'
                secureTextEntry={true}
                placeholder="0000"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                error={errors.passwordConfirm}
            />
            <Button
                title='Сохранить'
                onPress={handleSave}
                size="M"
            />
            <ModalText
                title="Ответ"
                message={resultMessage}
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </View>
    )
}
