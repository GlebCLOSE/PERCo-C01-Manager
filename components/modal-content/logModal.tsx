import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useMemo, useState } from "react";
import { useController } from "../../providers/ControllerContext";
import { useTheme } from "../../providers/ThemeContext";
import type { AppPalette } from "../../constants/theme";

const PREVIEW_LIMIT = 80;

/** Кадры периодического/ручного опроса state — для фильтра в логе транспорта. */
function isStatePollFrame(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  if (o.get === "state") return true;
  const ans = o.answer;
  if (ans && typeof ans === "object" && ans !== null && "state" in ans) return true;
  return false;
}

function createStyles(p: AppPalette) {
  return StyleSheet.create({
    wrap: {
      width: "100%",
      maxHeight: 420,
      gap: 8,
      marginTop: 8,
    },
    warn: {
      fontFamily: "inter",
      fontSize: 12,
      color: p.modalWarnBody,
      fontWeight: "300",
    },
    hr: {
      height: 1,
      backgroundColor: p.modalWarnRule,
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
      color: p.modalWarnBodyMuted,
      fontStyle: "italic",
    },
    block: {
      gap: 4,
    },
    meta: {
      fontFamily: "inter",
      fontSize: 10,
      color: p.modalWarnBodyMuted,
    },
    json: {
      fontFamily: "monospace",
      fontSize: 10,
      color: p.modalWarnCodeText,
      backgroundColor: p.modalWarnCodeBg,
      borderWidth: 1,
      borderColor: p.modalWarnCodeBorder,
      borderRadius: 6,
      padding: 8,
    },
    modeRow: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
      alignItems: "center",
    },
    modeChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: p.modalWarnRule,
      backgroundColor: p.modalWarnCodeBg,
    },
    modeChipActive: {
      borderColor: p.modalActionBlue,
      backgroundColor: p.modalGlass,
    },
    modeChipText: {
      fontFamily: "inter",
      fontSize: 11,
      color: p.modalWarnBody,
    },
    clearBtn: {
      marginLeft: "auto",
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    clearBtnText: {
      fontFamily: "inter",
      fontSize: 11,
      color: p.modalActionBlue,
      textDecorationLine: "underline",
    },
    dirIn: {
      fontWeight: "700",
      color: p.modalWarnBody,
    },
    dirOut: {
      fontWeight: "700",
      color: p.modalWarnBodyMuted,
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "100%",
      paddingHorizontal: 2,
    },
    toggleLabel: {
      flex: 1,
      fontFamily: "inter",
      fontSize: 12,
      color: p.modalWarnBodyMuted,
      fontWeight: "400",
    },
  });
}

type LogMode = "events" | "transport";

export const LogModal = () => {
  const { events, transportLog, clearTransportLog } = useController();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [mode, setMode] = useState<LogMode>("transport");
  const [hideStatePoll, setHideStatePoll] = useState(true);

  const eventLines = useMemo(() => {
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

  const transportLines = useMemo(() => {
    const source =
      hideStatePoll ? transportLog.filter((e) => !isStatePollFrame(e.body)) : transportLog;
    return [...source].reverse().slice(0, PREVIEW_LIMIT).map((entry, idx) => {
      let raw: string;
      try {
        raw = JSON.stringify(entry.body, null, 2);
      } catch {
        raw = String(entry.body);
      }
      const at = new Date(entry.ts).toISOString();
      const dir = entry.direction === "in" ? "IN" : "OUT";
      return { idx, at, raw, dir, direction: entry.direction };
    });
  }, [transportLog, hideStatePoll]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.warn}>
        Лог для отладки. Режим «Транспорт WS» — все входящие и исходящие JSON-кадры после подключения (и
        запись рукопожатия при входе с этого устройства). «Push-события» — только сообщения с полем{" "}
        <Text style={{ fontFamily: "monospace" }}>event</Text>. Не передавайте данные третьим лицам.
      </Text>

      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeChip, mode === "transport" && styles.modeChipActive]}
          onPress={() => setMode("transport")}
        >
          <Text style={styles.modeChipText}>Транспорт WS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeChip, mode === "events" && styles.modeChipActive]}
          onPress={() => setMode("events")}
        >
          <Text style={styles.modeChipText}>Push-события</Text>
        </TouchableOpacity>
        {mode === "transport" ? (
          <TouchableOpacity style={styles.clearBtn} onPress={clearTransportLog}>
            <Text style={styles.clearBtnText}>Очистить транспорт</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {mode === "transport" ? (
        <View style={styles.toggleRow}>
          <Switch value={hideStatePoll} onValueChange={setHideStatePoll} />
          <Text style={styles.toggleLabel}>Скрыть get/answer state (опрос связи)</Text>
        </View>
      ) : null}

      <View style={styles.hr} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {mode === "events" ? (
          eventLines.length === 0 ? (
            <Text style={styles.empty}>Событий пока нет.</Text>
          ) : (
            eventLines.map(({ idx, at, raw }) => (
              <View key={`ev-${at}-${idx}`} style={styles.block}>
                <Text style={styles.meta}>{at}</Text>
                <Text style={styles.json} selectable>
                  {raw}
                </Text>
              </View>
            ))
          )
        ) : transportLines.length === 0 ? (
          <Text style={styles.empty}>Записей транспорта пока нет.</Text>
        ) : (
          transportLines.map(({ idx, at, raw, dir, direction }) => (
            <View key={`tr-${at}-${idx}`} style={styles.block}>
              <Text style={styles.meta}>
                <Text style={direction === "in" ? styles.dirIn : styles.dirOut}>{dir}</Text>
                {` · ${at}`}
              </Text>
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
