import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useMemo } from "react";
import { useController } from "../../providers/ControllerContext";
import type { PercoEvent } from "../../types/events";
import { useTheme } from "../../providers/ThemeContext";
import type { AppPalette } from "../../constants/theme";

const LABELS: Record<PercoEvent["event"], string> = {
  card: "Предъявление карты",
  pass_personal: "Проход персональный",
  pass_impersonal: "Проход обезличенный",
  refusal_personal: "Отказ прохода персональный",
  refusal_impersonal: "Отказ прохода обезличенный",
  pass_ban_personal: "Блокировка прохода персональный",
  pass_ban_impersonal: "Блокировка прохода обезличенный",
  break: "Взлом ИУ",
  exdev_long_open: "Длительное открытие ИУ",
  exdev_unlock: "Блокировка / разблокировка ИУ",
  input: "Вход (сигнал)",
  output: "Выход (сигнал)",
};

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    wrap: {
      width: "100%",
      maxHeight: 360,
      gap: 8,
      marginTop: 8,
    },
    summary: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.modalFormInk,
      fontWeight: "300",
    },
    summaryBold: {
      fontWeight: "700",
    },
    hr: {
      height: 1,
      backgroundColor: p.modalFormRule,
      width: "100%",
    },
    scroll: {
      width: "100%",
    },
    scrollContent: {
      gap: 6,
      paddingBottom: 8,
    },
    empty: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.glassModalBody,
      fontStyle: "italic",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
      paddingVertical: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: p.modalFormRule,
    },
    rowLabel: {
      flex: 1,
      fontFamily: "inter",
      fontSize: 12,
      color: p.glassModalHeading,
      fontWeight: "400",
    },
    rowCount: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.glassModalHeading,
      fontWeight: "700",
      minWidth: 28,
      textAlign: "right",
    },
  });
}

export const StatsModal = () => {
  const { events } = useController();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const rows = useMemo(() => {
    const counts = new Map<PercoEvent["event"], number>();
    for (const { event } of events) {
      const k = event.event;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const keys = [...counts.keys()].sort(
      (a, b) => (LABELS[a] ?? a).localeCompare(LABELS[b] ?? b, "ru")
    );
    return keys.map((key) => ({
      key,
      label: LABELS[key] ?? key,
      count: counts.get(key) ?? 0,
    }));
  }, [events]);

  const total = events.length;

  return (
    <View style={styles.wrap}>
      <Text style={styles.summary}>
        Всего событий в сессии: <Text style={styles.summaryBold}>{total}</Text>
      </Text>
      <View style={styles.hr} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {rows.length === 0 ? (
          <Text style={styles.empty}>Пока нет событий для статистики.</Text>
        ) : (
          rows.map(({ key, label, count }) => (
            <View key={key} style={styles.row}>
              <Text style={styles.rowLabel} numberOfLines={2}>
                {label}
              </Text>
              <Text style={styles.rowCount}>{count}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
