import { Text, View, StyleSheet, FlatList } from 'react-native';
import { InlineLoading } from '../../../components/ui/status/InlineLoading';
import { useFocusEffect } from 'expo-router';
import { ReaderLine } from '../../../components/ui/blocks/readerLine';
import { ButtonSquare } from '../../../components/ui/elements/buttons/buttonSquare';
import { ModalChildren } from '../../../components/ui/status/ModalChildren';
import { ReaderDetails } from '../../../components/modal-content/readerDetails';
import { useState, useCallback, useMemo } from 'react';
import { useControllerConfig } from '../../../hooks/useControllerConfig';
import { useTheme } from '../../../providers/ThemeContext';
import type { AppPalette } from '../../../constants/theme';
import type { ReaderParams } from '../../../hooks/useControllerConfig';

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

export default function ReadersScreen() {
    const { getInfo } = useControllerConfig();
    const { palette } = useTheme();
    const styles = useMemo(() => createStyles(palette), [palette]);

    const [activeReader, setActiveReader] = useState<ReaderParams | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [readerList, setReaderList] = useState<ReaderParams[]>([]);

    const handleGetReaderInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            const responses: unknown = await getInfo('reader', 'all');

            const readerArray = (responses as { reader?: ReaderParams }[])
                .map((item) => item.reader)
                .filter((r): r is ReaderParams => r !== undefined);

            readerArray.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

            setReaderList(readerArray);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getInfo]);

    useFocusEffect(
        useCallback(() => {
            handleGetReaderInfo();
            return () => {};
        }, [handleGetReaderInfo]),
    );

    const closeModal = () => {
        setActiveReader('');
    };

    const ItemSeparator = () => (
        <View style={{ height: 10, backgroundColor: 'transparent' }} />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Считыватели</Text>
            <View style={{ gap: 5 }}>
                <Text style={styles.subtitle}>Список устройств</Text>
                <FlatList
                    data={readerList}
                    ItemSeparatorComponent={ItemSeparator}
                    renderItem={({ item }) => (
                        <ReaderLine
                            number={item.number ?? 0}
                            type={item.type ?? 'Wiegand'}
                            exdevNumber={item.exdev_number ?? 1}
                            exdevDirNumber={item.exdev_direction ?? 0}
                            onPress={() => setActiveReader(item)}
                        />
                    )}
                />
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginTop: 10,
                    }}
                >
                    <ButtonSquare
                        title="Добавить считыватель"
                        onPress={() => {}}
                        icon={require('../../../assets/icons/addReader.png')}
                    />
                </View>
            </View>
            <ModalChildren title="Считыватель" visible={activeReader !== ''} onClose={closeModal}>
                {activeReader !== '' ? <ReaderDetails data={activeReader} /> : null}
            </ModalChildren>
            {isLoading ? (
                <View style={styles.loadingOverlay}>
                    <InlineLoading />
                </View>
            ) : null}
        </View>
    );
}
