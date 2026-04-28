import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Button } from "../ui/elements/buttons/Button";
import InputField from "../ui/elements/input/InputField";
import { saveDevice } from "../../storage/deviceStorage";
import { validateIP } from "../../utils/validation/validateIP";
import { validateDeviceName } from "../../utils/validation/validateDeviceName";
import { validatePassword } from "../../utils/validation/validatePassword";

export type AddDeviceModalProps = {
  onSaved: () => void | Promise<void>;
};

export const AddDeviceModal = ({ onSaved }: AddDeviceModalProps) => {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const next: Record<string, string> = {};
    const ipErr = validateIP(ip);
    if (ipErr) next.ip = ipErr;
    const nameErr = validateDeviceName(name);
    if (nameErr) next.name = nameErr;
    const passErr = validatePassword(password);
    if (passErr) next.password = passErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const result = await saveDevice(
      name.trim(),
      ip.trim(),
      password.trim() === "" ? null : password.trim()
    );
    if (!result.success) {
      Alert.alert("Не удалось сохранить", result.message ?? "Неизвестная ошибка");
      return;
    }
    setName("");
    setIp("");
    setPassword("");
    setErrors({});
    await onSaved();
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.smallText}>
          Укажите имя, IP-адрес и пароль контроллера. Имя и IP должны быть уникальными в списке
          запомненных устройств.
        </Text>
        <View style={styles.hr} />
        <InputField
          label="Имя устройства"
          size="s"
          placeholder="Controller01"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <InputField
          label="IP-адрес"
          size="s"
          placeholder="192.168.1.1"
          value={ip}
          onChangeText={setIp}
          keyboardType="decimal-pad"
          error={errors.ip}
        />
        <InputField
          label="Пароль"
          size="s"
          placeholder="Необязательно"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />
        <Button title="Сохранить" onPress={() => void handleSave()} size="M" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    width: "100%",
    maxHeight: 400,
    marginTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: "100%",
    gap: 7,
  },
  smallText: {
    fontFamily: "inter",
    fontSize: 12,
    color: "#000670",
    fontWeight: "300",
  },
  hr: {
    height: 1,
    backgroundColor: "#000670",
  },
});
