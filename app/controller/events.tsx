import { ScrollView, Text, View, StyleSheet } from "react-native";
import { EventLine } from "../../components/ui/blocks/eventLine";
import { useController } from "../../providers/ControllerContext";
import { ButtonSquare } from "../../components/ui/elements/buttons/buttonSquare";
import { useMemo, useState } from "react";
import { ModalChildren } from "../../components/ui/status/ModalChildren";
import { StatsModal } from "../../components/modal-content/statsModal";
import {
    FilterModal,
    EVENT_TYPE_KEYS,
} from "../../components/modal-content/filterModal";
import { LogModal } from "../../components/modal-content/logModal";
import { EventDetailModal } from "../../components/modal-content/eventDetailModal";
import { shortEventLabel, type PercoEvent } from "../../types/events";
import { useTheme } from "../../providers/ThemeContext";
import type { AppPalette } from "../../constants/theme";

function createStyles(p: AppPalette) {
    return StyleSheet.create({
        title: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        blockButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        textTitle: {
            fontFamily: 'inter',
            fontSize: 24,
            fontWeight: '400',
            color: p.sectionHeading,
        },
        clear: {
            fontFamily: 'inter',
            fontSize: 14,
            color: p.textSecondary,
            textDecorationLine: 'underline',
        },
    });
}


export default function EventsScreen() {

    const { palette } = useTheme();
    const themed = useMemo(() => createStyles(palette), [palette]);


    const [detailSelection, setDetailSelection] = useState<{
        event: PercoEvent;
        receivedAt: number;
    } | null>(null);

    const [modalType, setModalType] = useState(''); // 'STATS' | 'FILTER' | 'LOG' | ''

    const allTypesSet = useMemo(
        () => new Set<PercoEvent["event"]>(EVENT_TYPE_KEYS),
        []
    );
    const [enabledEventTypes, setEnabledEventTypes] = useState<
        Set<PercoEvent["event"]>
    >(() => new Set(allTypesSet));

    const closeModal = () => setModalType("");
    const isWarn = modalType === "LOG";

    const titles = new Map<string, string>([
        ['STATS', 'Статистика по событиям'],
        ['FILTER', 'Фильтр событий'],
        ['LOG', 'Лог для разработчика'],
    ]);

    const modalTitle = titles.get(modalType) || '';

    // Функция-хелпер для отрисовки контента
    const renderModalContent = () => {
        switch (modalType) {
            case 'STATS':
                return (<StatsModal />);
            case 'FILTER':
                return (
                    <FilterModal
                        enabled={enabledEventTypes}
                        onToggle={(key) => {
                            setEnabledEventTypes((prev) => {
                                const next = new Set(prev);
                                if (next.has(key)) next.delete(key);
                                else next.add(key);
                                return next;
                            });
                        }}
                        onSelectAll={() =>
                            setEnabledEventTypes(new Set(allTypesSet))
                        }
                        onClearAll={() =>
                            setEnabledEventTypes(new Set())
                        }
                    />
                );
            case 'LOG':
                return (<LogModal />);
            default:
            return null;
        }
    };

    const { events, clearEvents } = useController();

    const visibleEvents = useMemo(
        () => events.filter((e) => enabledEventTypes.has(e.event.event)),
        [events, enabledEventTypes]
    );
    return (
        <View style={{ flex: 1, width: '100%', gap: 10 }}>
            <View style={themed.title}>
                <Text style={themed.textTitle}>События</Text>
                <Text style={themed.clear} onPress={clearEvents}>Очистить</Text>
            </View>
            <View style={themed.blockButtons}>
                <ButtonSquare title='Статистика по событиям' onPress={()=>{setModalType('STATS')}} icon={require('../../assets/icons/Stats.png')} />
                <ButtonSquare title='Фильтр событий' onPress={()=>{setModalType('FILTER')}} icon={require('../../assets/icons/Filter.png')} />
                <ButtonSquare title='Лог для разработчика' onPress={()=>{setModalType('LOG')}} icon={require('../../assets/icons/log.png')} isYellow={true} />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
                {visibleEvents.slice().reverse().map((e, idx) => (
                    <EventLine
                        key={`${e.receivedAt}-${idx}`}
                        event={e.event}
                        receivedAt={e.receivedAt}
                        onPress={() =>
                            setDetailSelection({
                                event: e.event,
                                receivedAt: e.receivedAt,
                            })
                        }
                    />
                ))}
            </ScrollView>
            <ModalChildren
                title={
                    detailSelection
                        ? shortEventLabel(detailSelection.event)
                        : ""
                }
                visible={detailSelection !== null}
                onClose={() => setDetailSelection(null)}
            >
                {detailSelection ? (
                    <EventDetailModal
                        event={detailSelection.event}
                        receivedAt={detailSelection.receivedAt}
                    />
                ) : null}
            </ModalChildren>
            <ModalChildren title={modalTitle} visible={modalType !== ''} onClose={closeModal} isWarn={isWarn}>
                {renderModalContent()}
            </ModalChildren>
        </View>
    );
}
