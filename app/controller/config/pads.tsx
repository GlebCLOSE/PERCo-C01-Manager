import { Text, StyleSheet, View, FlatList } from "react-native";
import { InlineLoading } from "../../../components/ui/status/InlineLoading";
import { WarningText } from "../../../components/ui/blocks/warningText";
import { PadLine } from "../../../components/ui/blocks/padLine";
import { PadDetails } from "../../../components/modal-content/padDetails";
import { ModalChildren } from "../../../components/ui/status/ModalChildren";
import { useState, useCallback, useMemo, useRef } from "react";
import { useFocusEffect } from 'expo-router';
import { useControllerConfig } from "../../../hooks/useControllerConfig";
import { PadParams } from "../../../hooks/useControllerConfig";
import { IconButton } from "../../../components/ui/elements/buttons/IconButton";
import { useController } from "../../../providers/ControllerContext";
import { useTheme } from "../../../providers/ThemeContext";
import type { AppPalette } from "../../../constants/theme";
import { themedIcon } from "../../../constants/themedIcons";

function createStyles(p: AppPalette) {
    return StyleSheet.create({
        headerBlock: {
            gap: 10,
            marginBottom: 10,
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: 16,
        },
        titleBlock: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between'
        },
        title: {
            fontFamily: 'inter',
            fontSize: 24,
            fontWeight: '400',
            color: p.sectionHeading,
        },
        blockButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between'
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

export default function PadsScreen() {

    const { getInfo } = useControllerConfig()
    const { palette, scheme } = useTheme();
    const styles = useMemo(() => createStyles(palette), [palette]);
    const { configRevision } = useController();
    const lastRevisionRef = useRef<number>(configRevision);
    const [activePad, setActivePad] = useState<PadParams | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [padList, setPadList] = useState<PadParams[]>([])
    
    const refreshIcon = useMemo(() => themedIcon('refresh', scheme), [scheme]);

    const handleGetPadInfo = useCallback(async () => {
        setIsLoading(true);
        try {
            // Теперь data — это массив ответов: [{"answer":..., "pad":...}, {...}]
            const responses: any = await getInfo('pad', 'all');
            
            // Извлекаем только объекты pad из каждого ответа
            const padArray = responses
                .map((item: any) => item.pad)
                .filter((pad: any) => pad !== undefined);

            // Сортируем по номеру
            padArray.sort((a: PadParams, b: PadParams) => (a.number ?? 0) - (b.number ?? 0));

            setPadList(padArray);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setIsLoading(false);
        }
    }, [getInfo]);

    useFocusEffect(
        useCallback(() => {
            const isConfigJustChanged = lastRevisionRef.current !== configRevision;
            lastRevisionRef.current = configRevision;

            // Контроллер может применить конфигурацию не мгновенно:
            // делаем небольшой "пост-коммит" refetch при изменении конфигурации.
            const timeout = setTimeout(() => {
                handleGetPadInfo();
            }, isConfigJustChanged ? 250 : 0);

            return () => {
                clearTimeout(timeout);
            };
        }, [handleGetPadInfo, configRevision])
    );

    const closeModal = () => {
        setActivePad(null)
    }

    const ItemSeparator = () => (
        <View style={{ height: 10, backgroundColor: 'transparent' }} />
    );

    const listHeader = (
        <View style={styles.headerBlock}>
            <View style={styles.titleBlock}>
                <Text style={styles.title}>Физические контакты</Text>
                <IconButton
                    onPress={handleGetPadInfo}
                    icon={refreshIcon}
                    hasBorder={false}
                    size="M"
                />
            </View>
            <WarningText text="Необдуманные действия в этом разделе могут привести к некорректной работе контроллера" />
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={padList}
                keyExtractor={(item, index) =>
                    item.number !== undefined ? `pad-${item.number}` : `pad-i-${index}`
                }
                ListHeaderComponent={listHeader}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <PadLine
                        number={item.number ?? 0}
                        type={item.function ?? ''}
                        onPress={() => {
                            setActivePad(item);
                        }}
                    />
                )}
                ItemSeparatorComponent={ItemSeparator}
            />
            <ModalChildren title={'Вход'} visible={activePad !== null} onClose={closeModal}>
                {activePad ? <PadDetails data={activePad} /> : null}
            </ModalChildren>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <InlineLoading />
                </View>
            )}
        </View>
    );
};
