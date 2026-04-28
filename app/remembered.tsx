import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/elements/buttons/Button";
import { RememberedDevice } from "../components/ui/blocks/rememberedDevice";
import { Device } from "../types/device";
import { getDevices, removeDevice } from "../storage/deviceStorage";
import { ModalChildren } from "../components/ui/status/ModalChildren";
import { AddDeviceModal } from "../components/modal-content/addDeviceModal";

export default function RememberedScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const loadDevices = useCallback(async () => {
    const loadedDevices = await getDevices();
    setDevices(loadedDevices);
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  const handleRemove = async (name: string, ip: string) => {
    const result = await removeDevice({ ip, name });

    try {
      if (result.success) {
        alert("Устройство удалено из списка");
        await loadDevices();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: { item: Device }) => (
    <RememberedDevice
      name={item.name}
      ip={item.ip}
      password={item.password ?? ""}
      onDelete={() => handleRemove(item.name, item.ip)}
    />
  );

  return (
    <View style={styles.window}>
      <View style={styles.header}>
        <Button
          title="Назад"
          onPress={() => router.back()}
          size="S"
          customStyles={styles.headerButton}
          customTextStyles={styles.headerButtonText}
        />
        <Text style={styles.headerText}>Запомненные устройства</Text>
      </View>
      <View style={styles.list}>
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Нет устройств</Text>}
          contentContainerStyle={devices.length === 0 ? styles.emptyList : undefined}
        />
      </View>
      <View style={styles.footer}>
        <Button
          title="Добавить устройство"
          onPress={() => setAddModalVisible(true)}
          size="L"
          customStyles={styles.addDeviceButton}
        />
      </View>
      <ModalChildren
        title="Добавить устройство"
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <AddDeviceModal
          onSaved={async () => {
            await loadDevices();
            setAddModalVisible(false);
          }}
        />
      </ModalChildren>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00067033",
    backgroundColor: "#e8f8ff73",
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#0A3A99",
    width: "100%",
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 7,
    gap: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffffe0",
  },
  headerButton: {
    backgroundColor: "#ffffff2a",
    borderWidth: 1,
    borderColor: "#ffffff55",
    paddingHorizontal: 12,
  },
  headerButtonText: {
    color: "#ffffff",
  },
  list: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    padding: 7,
    gap: 7,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 7,
    paddingTop: 4,
    paddingBottom: 10,
    backgroundColor: "#e8f8ff73",
    borderTopWidth: 1,
    borderTopColor: "#00067022",
  },
  addDeviceButton: {
    width: "100%",
    alignSelf: "stretch",
  },
  emptyText: {
    fontSize: 14,
    color: "#00067099",
    textAlign: "center",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
