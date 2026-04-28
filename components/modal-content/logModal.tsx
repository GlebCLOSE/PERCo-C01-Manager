import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useMemo } from "react";
import { useController } from "../../providers/ControllerContext";

const PREVIEW_LIMIT = 80;

export const LogModal = () => {
  const { events } = useController();

  const lines = useMemo(() => {
    return [...events]
      .reverse()
      .slice(0, PREVIEW_LIMIT)
      .map((item, idx) => {
        let raw: string;
        try {
          raw = JSON.stringify(item.event, null, 2);
        } catch {
          raw = String(item.event);
        }
        const at = new Date(item.receivedAt).toISOString();
        return { idx, at, raw };
      });
  }, [events]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.warn}>
        Сырые полезные нагрузки последних событий (до {PREVIEW_LIMIT} записей, новые сверху). Не
        передавайте лог третьим лицам — в данных могут быть идентификаторы карт.
      </Text>
      <View style={styles.hr} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {lines.length === 0 ? (
          <Text style={styles.empty}>Событий пока нет.</Text>
        ) : (
          lines.map(({ idx, at, raw }) => (
            <View key={`${at}-${idx}`} style={styles.block}>
              <Text style={styles.meta}>{at}</Text>
              <Text style={styles.json} selectable>
                {raw}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    maxHeight: 420,
    gap: 8,
    marginTop: 8,
  },
  warn: {
    fontFamily: "inter",
    fontSize: 12,
    color: "#580000",
    fontWeight: "300",
  },
  hr: {
    height: 1,
    backgroundColor: "#580000",
    width: "100%",
  },
  scroll: {
    width: "100%",
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 8,
  },
  empty: {
    fontFamily: "inter",
    fontSize: 12,
    color: "#58000099",
    fontStyle: "italic",
  },
  block: {
    gap: 4,
  },
  meta: {
    fontFamily: "inter",
    fontSize: 10,
    color: "#580000b0",
  },
  json: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#fff8f0",
    borderWidth: 1,
    borderColor: "#58000033",
    borderRadius: 6,
    padding: 8,
  },
});
