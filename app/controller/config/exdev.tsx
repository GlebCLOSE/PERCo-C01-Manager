import { Text, StyleSheet, View, FlatList } from 'react-native';
import { InlineLoading } from '../../../components/ui/status/InlineLoading';
import { ButtonSquare } from '../../../components/ui/elements/buttons/buttonSquare';
import { ExdevLine } from '../../../components/ui/blocks/exdevLine';
import { useState, useCallback, useMemo } from 'react';
import { ModalChildren } from '../../../components/ui/status/ModalChildren';
import { ExdevDetails } from '../../../components/modal-content/exdevDetails';
import { useFocusEffect } from 'expo-router';
import { useControllerConfig } from '../../../hooks/useControllerConfig';
import { mapExdevNames } from '../../../types/maps';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import type { ExdevParams } from '../../../hooks/useControllerConfig';

function createStyles(p: AppPalette) {
    return StyleSheet.create({
        container: {
            gap: 20,
            justifyContent: 'flex-start',
        },
        title: {
            fontFamily: 'inter',
            fontSize: 24,
            fontWeight: '400',
            color: p.sectionHeading,
        },
        subtitle: {
            fontFamily: 'inter',
            fontSize: 16,
            fontWeight: '400',
            color: p.textTertiary,
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

export default function ExdevScreen() {
    const { getInfo } = useControllerConfig();
    const { palette } = useTheme();
    const styles = useMemo(() => createStyles(palette), [palette]);

    const [activeExdev, setActiveExdev] = useState<ExdevParams | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [exdevList, setExdevList] = useState<ExdevParams[]>([]);

    const handleGetExdevInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            const responses: unknown = await getInfo('exdev', 'all');
            const exdevArray = (responses as { exdev?: ExdevParams }[])
                .map((item) => item.exdev)
                .filter((exdev): exdev is ExdevParams => exdev !== undefined);

            exdevArray.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

            setExdevList(exdevArray);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getInfo]);

    useFocusEffect(
        useCallback(() => {
            handleGetExdevInfo();
            return () => {};
        }, [handleGetExdevInfo]),
    );

    function closeModal() {
        setActiveExdev('');
    }

    const ItemSeparator = () => (
        <View style={{ height: 10, backgroundColor: 'transparent' }} />
    );

    const exdevTitle =
        activeExdev !== '' && activeExdev.type
            ? mapExdevNames.get(activeExdev.type) ?? ''
            : '';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Исполнительные устройства</Text>
            <View style={{ gap: 5 }}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <FlatList
                    data={exdevList}
                    style={{ gap: 10 }}
                    renderItem={({ item }) => (
                        <ExdevLine
                            number={item.number ?? 0}
                            type={
                                (item.type ?? 'lock') as
                                    | 'lock'
                                    | 'double lock'
                                    | 'turnstyle'
                                    | 'gate'
                            }
                            onPress={() => setActiveExdev(item)}
                        />
                    )}
                    ItemSeparatorComponent={ItemSeparator}
                />
            </View>
            <ModalChildren title={exdevTitle} visible={activeExdev !== ''} onClose={closeModal}>
                {activeExdev !== '' ? <ExdevDetails data={activeExdev} /> : null}
            </ModalChildren>
            <ButtonSquare title="Добавить ИУ" onPress={() => {}} icon={require('../../../assets/icons/addiu.png')} />
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <InlineLoading />
                </View>
            ) : null}
        </View>
    );
}
