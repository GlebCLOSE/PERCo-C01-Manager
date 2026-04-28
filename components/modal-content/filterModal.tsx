import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Button } from "../ui/elements/buttons/Button";
import type { PercoEvent } from "../../types/events";

export const EVENT_TYPE_KEYS: PercoEvent["event"][] = [
  "card",
  "pass_personal",
  "pass_impersonal",
  "refusal_personal",
  "refusal_impersonal",
  "pass_ban_personal",
  "pass_ban_impersonal",
  "break",
  "exdev_long_open",
  "exdev_unlock",
  "input",
  "output",
];

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
  exdev_unlock: "Разблокировка ИУ",
  input: "Вход (сигнал)",
  output: "Выход (сигнал)",
};

export type FilterModalProps = {
  enabled: ReadonlySet<PercoEvent["event"]>;
  onToggle: (key: PercoEvent["event"]) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export const FilterModal = ({
  enabled,
  onToggle,
  onSelectAll,
  onClearAll,
}: FilterModalProps) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>
        Отметьте типы событий, которые нужно показывать в списке на экране «События».
      </Text>
      <View style={styles.actions}>
        <Button title="Все" onPress={onSelectAll} size="S" />
        <Button title="Снять все" onPress={onClearAll} size="S" />
      </View>
      <View style={styles.hr} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {EVENT_TYPE_KEYS.map((key) => {
          const on = enabled.has(key);
          return (
            <Pressable
              key={key}
              onPress={() => onToggle(key)}
              style={[styles.chip, on ? styles.chipOn : styles.chipOff]}
            >
              <Text style={[styles.chipText, on ? styles.chipTextOn : styles.chipTextOff]}>
                {on ? "✓ " : ""}
                {LABELS[key]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    maxHeight: 400,
    gap: 8,
    marginTop: 8,
  },
  hint: {
    fontFamily: "inter",
    fontSize: 12,
    color: "#000670",
    fontWeight: "300",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  hr: {
    height: 1,
    backgroundColor: "#000670",
    width: "100%",
  },
  scroll: {
    width: "100%",
  },
  scrollContent: {
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  chipOn: {
    backgroundColor: "#adc4ff50",
    borderColor: "#00047080",
  },
  chipOff: {
    backgroundColor: "#f5f5f5",
    borderColor: "#00000022",
  },
  chipText: {
    fontFamily: "inter",
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextOn: {
    color: "#000670",
  },
  chipTextOff: {
    color: "#00067088",
  },
});
