import { Text, View, StyleSheet } from 'react-native';
import { InlineLoading } from '../../components/ui/status/InlineLoading';
import { ExdevState } from '../../components/ui/blocks/exdevState';
import { StateField } from '../../components/ui/elements/stateField';
import { useState, useCallback, useMemo } from 'react';
import { useControllerCommands } from '../../hooks/useControllerCommands';
import ErrorModal from '../../components/ui/status/ErrorModal';
import { Button } from '../../components/ui/elements/buttons/Button';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../providers/ThemeContext';
import type { AppPalette } from '../../constants/theme';

function createStyles(p: AppPalette) {
    return StyleSheet.create({
        title: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
        },
        block: {
            width: '100%',
            gap: 10,
            flexDirection: 'column',
        },
        textL: {
            fontSize: 24,
            fontFamily: 'inter',
            fontWeight: '300',
            color: p.sectionHeading,
        },
        textM: {
            fontSize: 16,
            fontFamily: 'inter',
            fontWeight: '300',
            color: p.textSecondary,
        },
        loadingOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: p.loadingOverlayBg,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
    });
}

export default function StateScreen() {
    const [type, setType] = useState('');
    const [acm, setAcm] = useState('');
    const [status, setStatus] = useState('');
    const [pass, setPass] = useState('');
    const [exdevs, setExdevs] = useState([
        {
            number: 1,
            type: 'turnstyle',
            physical_state: ['', ''],
            unlock_state: ['', ''],
            access_mode: ['', ''],
        },
        {
            number: 2,
            type: 'turnstyle',
            physical_state: ['', ''],
            unlock_state: ['', ''],
            access_mode: ['', ''],
        },
    ]);

    const [coverOn, setCoverOn] = useState('нет данных');
    const [ipMode, setIpMode] = useState('нет данных');
    const [voltage, setVoltage] = useState('нет данных');
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [stateData, setStateData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { palette } = useTheme();
    const styles = useMemo(() => createStyles(palette), [palette]);

    const { getState, getExdevInfo } = useControllerCommands();

    const handleGetState = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: any = await getState();

            if (data.answer?.state === 'ok') {
                const state = data.state;

                const exdevArray: any[] = [{}, {}];

                for (let i = 0; i < 2; i++) {
                    const exdevInfo: any = await getExdevInfo(i);

                    exdevArray[i].number = i;
                    exdevArray[i].type = exdevInfo.exdev['type'];

                    exdevArray[i].acm = state.exdev[i]['access_state']?.[0];
                    exdevArray[i].status = state.exdev[i]['unlock_state']?.[0];
                    exdevArray[i].pass = state.exdev[i]['physical_state']?.[0];
                }

                setExdevs(exdevArray);

                setCoverOn(state['cover_on'] ? 'Открыта' : 'Закрыта');

                if (state['ip_mode'] === true) {
                    setIpMode('DHCP Mode');
                } else if (state['ip_default'] === true) {
                    setIpMode('IP Default');
                } else {
                    setIpMode('Пользовательский режим');
                }

                setVoltage(state['value_suply'] / 1000 + ' В');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Произошла непредвиденная ошибка при получении данных');
            setIsErrorModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            handleGetState();
            return () => {};
        }, [handleGetState]),
    );

    const exdevStates = exdevs.map((el: any) => {
        return (
            <ExdevState
                key={el.number}
                number={el.number}
                type={el.type}
                acm={el.acm}
                status={el.status}
                pass={el.pass}
            />
        );
    });

    return (
        <View style={{ flex: 1, width: '100%', gap: 16 }}>
            <View style={styles.title}>
                <Text style={styles.textL}>Состояние</Text>
                <Button title="Обновить" onPress={handleGetState} size="S" />
            </View>
            <View style={styles.block}>
                <Text style={styles.textM}>Исполнительные устройства</Text>
                {exdevStates}
            </View>
            <View style={styles.block}>
                <Text style={styles.textM}>Контроллер</Text>
                <StateField title={'Верхняя крышка'} value={coverOn} />
                <StateField title={'Режим XP1'} value={ipMode} />
                <StateField title={'Напряжение'} value={voltage} />
                <ErrorModal
                    visible={isErrorModalVisible}
                    message={errorMessage}
                    onClose={() => setIsErrorModalVisible(false)}
                />
            </View>
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <InlineLoading />
                </View>
            ) : null}
        </View>
    );
}
