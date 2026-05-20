import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useMemo } from "react";
import {
  handleEvent,
  getEventDetailRows,
  type PercoEvent,
} from "../../types/events";
import { useTheme } from "../../providers/ThemeContext";
import type { AppPalette } from "../../constants/theme";

export type EventDetailModalProps = {
  event: PercoEvent;
  receivedAt: number;
};

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    scroll: {
      width: "100%",
      maxHeight: 420,
      marginTop: 8,
    },
    scrollInner: {
      gap: 10,
      paddingBottom: 8,
    },
    block: {
      gap: 4,
      width: "100%",
    },
    label: {
      fontFamily: "inter",
      fontSize: 11,
      color: p.modalMuted,
      fontWeight: "500",
      textTransform: "uppercase",
    },
    value: {
      fontFamily: "inter",
      fontSize: 14,
      color: p.glassModalHeading,
      fontWeight: "400",
    },
    timeValue: {
      fontFamily: "inter",
      fontSize: 16,
      color: p.glassModalHeading,
      fontWeight: "700",
    },
    sectionTitle: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.sectionHeading,
      fontWeight: "700",
    },
    fullText: {
      fontFamily: "inter",
      fontSize: 13,
      color: p.glassModalBody,
      fontWeight: "400",
      lineHeight: 20,
    },
    hr: {
      height: 1,
      backgroundColor: p.modalFormRule,
      width: "100%",
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      paddingVertical: 4,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: p.modalFormRule,
    },
    paramLabel: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.modalMuted,
      minWidth: 120,
      fontWeight: "500",
    },
    paramValue: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.modalFormInk,
      flex: 1,
      fontWeight: "400",
      minWidth: "50%",
    },
  });
}

export const EventDetailModal = ({
  event,
  receivedAt,
}: EventDetailModalProps) => {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const dt = new Date(receivedAt);
  const dateStr = dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = dt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const fullTitle = handleEvent(event);
  const rows = getEventDetailRows(event);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollInner}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.block}>
        <Text style={styles.label}>Дата и время</Text>
        <Text style={styles.value}>{dateStr}</Text>
        <Text style={styles.timeValue}>{timeStr}</Text>
      </View>
      <View style={styles.hr} />
      <View style={styles.block}>
        <Text style={styles.label}>Полное описание</Text>
        <Text style={styles.fullText}>{fullTitle}</Text>
      </View>
      <View style={styles.hr} />
      <Text style={styles.sectionTitle}>Параметры</Text>
      {rows.map(({ label, value }, index) => (
        <View key={`${index}-${label}`} style={styles.row}>
          <Text style={styles.paramLabel}>{label}</Text>
          <Text selectable style={styles.paramValue}>
            {value}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};
