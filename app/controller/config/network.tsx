import { Text, ScrollView, View, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { validateIP } from '../../../utils/validation/validateIP';
import IPAddressInput from '../../../components/ui/elements/input/IPAddressInput';
import { WarningText } from '../../../components/ui/blocks/warningText';
import ErrorModal from '../../../components/ui/status/ErrorModal';
import { ButtonSquare } from '../../../components/ui/elements/buttons/buttonSquare';
import { Button } from '../../../components/ui/elements/buttons/Button';
import { ModalChildren } from '../../../components/ui/status/ModalChildren';
import { FactoryModal } from '../../../components/modal-content/factoryModal';
import { ServerModal } from '../../../components/modal-content/serverModal';
import { PasswordModal } from '../../../components/modal-content/passwordModal';
import { useControllerConfig } from '../../../hooks/useControllerConfig';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import { themedIcon } from '../../../constants/themedIcons';

function createStyles(_p: AppPalette) {
    return StyleSheet.create({
        title: {
            fontFamily: 'inter',
            fontSize: 24,
            fontWeight: '400',
            color: _p.sectionHeading,
        },
        blockButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    });
}

export default function NetworkScreen() {
    const { palette, scheme } = useTheme();
    const styles = useMemo(() => createStyles(palette), [palette]);

    const serversIcon = useMemo(() => themedIcon('servers', scheme), [scheme]);
    const passwordIcon = useMemo(() => themedIcon('password', scheme), [scheme]);
    const factoryIcon = useMemo(() => themedIcon('factory', scheme), [scheme]);

    const [errors, setErrors] = useState<{
        ip?: string;
        mask?: string;
        gateway?: string;
    }>({});
    const [modalType, setModalType] = useState('');
    const [ip, setIp] = useState('');
    const [mask, setMask] = useState('');
    const [gateway, setGateway] = useState('');
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setNetworkSettings } = useControllerConfig();

    const isWarn = modalType === 'FACTORY';

    const closeModal = () => {
        setModalType('');
    };

    const titles = new Map<string, string>([
        ['SERVER', 'Обратное подключение'],
        ['PASSWORD', 'Установка пароля'],
        ['FACTORY', 'Сброс до заводских'],
    ]);

    const modalTitle = titles.get(modalType) || '';
    const renderModalContent = () => {
        switch (modalType) {
            case 'SERVER':
                return <ServerModal />;
            case 'PASSWORD':
                return <PasswordModal />;
            case 'FACTORY':
                return <FactoryModal />;
            default:
                return null;
        }
    };

    const validateForm = () => {
        const newErrors: { ip?: string; mask?: string; gateway?: string } = {};

        const ipError = validateIP(ip);
        if (ipError) newErrors.ip = ipError;

        const maskError = validateIP(mask);
        if (maskError) newErrors.mask = maskError;

        const gatewayError = validateIP(gateway);
        if (gatewayError) newErrors.gateway = gatewayError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSetNetworkSettings = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const result = await setNetworkSettings({ ip: ip, mask: mask, gateway: gateway });
            const isOk = result?.answer?.net === 'ok';
            if (isOk) {
                setErrorMessage('Сетевые настройки успешно установлены');
                setIsErrorModalVisible(true);
            } else {
                setErrorMessage('Ошибка при передаче данных');
                setIsErrorModalVisible(true);
            }
        } catch {
            setErrorMessage('Сетевая ошибка');
            setIsErrorModalVisible(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
            <Text style={styles.title}>Сетевые настройки</Text>
            <View style={styles.blockButtons}>
                <ButtonSquare
                    title="Указать IP сервера"
                    onPress={() => setModalType('SERVER')}
                    icon={serversIcon}
                />
                <ButtonSquare
                    title="Сменить пароль"
                    onPress={() => setModalType('PASSWORD')}
                    icon={passwordIcon}
                />
                <ButtonSquare
                    title="Сброс до заводских"
                    onPress={() => setModalType('FACTORY')}
                    icon={factoryIcon}
                    isYellow={true}
                />
            </View>
            <WarningText text="При замене IP-адреса потеряется связь с контроллером. Потребуется повторное подключение" />
            <IPAddressInput
                label="IP‑адрес"
                placeholder="192.168.1.144"
                value={ip}
                onChangeText={setIp}
                error={errors.ip}
            />
            <IPAddressInput
                label="Маска подсети"
                placeholder="255.0.0.0"
                value={mask}
                onChangeText={setMask}
                error={errors.mask}
            />
            <IPAddressInput
                label="Шлюз"
                placeholder="192.168.1.1"
                value={gateway}
                onChangeText={setGateway}
                error={errors.gateway}
            />
            <Button title="Отправить" onPress={handleSetNetworkSettings} size="M" />
            <ErrorModal
                visible={isErrorModalVisible}
                message={errorMessage}
                onClose={() => setIsErrorModalVisible(false)}
            />
            <ModalChildren title={modalTitle} visible={modalType !== ''} onClose={closeModal} isWarn={isWarn}>
                {renderModalContent()}
            </ModalChildren>
        </ScrollView>
    );
}
