import { Text, ScrollView, View, StyleSheet } from "react-native";
import { useState } from "react";
import { validateIP } from "../../../utils/validation/validateIP";
import InputField from "../../../components/ui/elements/input/InputField";
import { WarningText } from "../../../components/ui/blocks/warningText";
import ErrorModal from "../../../components/ui/status/ErrorModal";
import { useControllerCommands } from "../../../hooks/useControllerCommands";
import { ButtonSquare } from "../../../components/ui/elements/buttons/buttonSquare";
import { Button } from "../../../components/ui/elements/buttons/Button";
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { FactoryModal } from "../../../components/modal-content/factoryModal";
import { ServerModal } from "../../../components/modal-content/serverModal";
import { PasswordModal } from "../../../components/modal-content/passwordModal";

export default function NetworkScreen() {

    const [errors, setErrors] = useState({});
    const [modalType, setModalType] = useState(''); // 'SERVER' | 'PASSWORD' | 'FACTORY' | ''

    // Передаём в окно параметр isWarn true только при типе модального окна FACTORY
    const isWarn = modalType === 'FACTORY';

    const closeModal = () => {
        setModalType('');
    };

    // Функция-хелпер для отрисовки контента
    const renderModalContent = () => {
        switch (modalType) {
            case 'SERVER':
                return (<ServerModal />);
            case 'PASSWORD':
                return (<PasswordModal />);
            case 'FACTORY':
                return (<FactoryModal />);
            default:
            return null;
        }
    };

      const validateForm = () => {
        const newErrors = {};
    
        const ipError = validateIP(ip);
        if (ipError) newErrors.ip = ipError;
    
        const maskError = validateIP(mask);
        if (maskError) newErrors.mask = maskError;
    
        const gatewayError = validateIP(gateway);
        if (gatewayError) newErrors.gateway = gatewayError;
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
    
    const [ip, setIp] = useState('')
    const [mask, setMask] = useState('')
    const [gateway, setGateway] = useState('')
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSet = async () => {
        if (!validateForm()) {
            return;
        }

    }

    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                <Text style={styles.title}>Сетевые настройки</Text>
                <View style={styles.blockButtons}>
                    <ButtonSquare title='Указать IP сервера' onPress={()=>{setModalType('SERVER')}} icon={require('../../../assets/icons/servers.png')} />
                    <ButtonSquare title='Сменить пароль' onPress={()=>{setModalType('PASSWORD')}} icon={require('../../../assets/icons/password.png')} />
                    <ButtonSquare title='Сброс до заводских' onPress={()=>{setModalType('FACTORY')}} icon={require('../../../assets/icons/factory.png')} isYellow={true} />
                </View>
                <WarningText text="При замене IP-адреса потеряется связь с контроллером. Потребуется повторное подключение"/>
                <InputField
                label="IP‑адрес"
                placeholder="192.168.1.144"
                value={ip}
                onChangeText={setIp}
                error={errors.ip}
                keyboardType="numeric"
                />
                <InputField
                label="Маска подсети"
                placeholder="255.0.0.0"
                value={mask}
                onChangeText={setMask}
                error={errors.mask}
                keyboardType="numeric"
                />
                <InputField
                label="Шлюз"
                placeholder="192.168.1.1"
                value={gateway}
                onChangeText={setGateway}
                error={errors.gateway}
                keyboardType="numeric"
                />
                <Button title='Отправить' onPress={()=>{}} size='M'/>
                <ErrorModal
                visible={isErrorModalVisible}
                message={errorMessage}
                onClose={() => setIsErrorModalVisible(false)}
                />
                <ModalChildren title={'Test'} visible={modalType !== ''} onClose={closeModal} isWarn={isWarn}>
                    {renderModalContent()}
                </ModalChildren>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'inter',
        fontSize: 24,
        fontWeight: '400',
        color: '#1A2253'
    },
    blockButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})