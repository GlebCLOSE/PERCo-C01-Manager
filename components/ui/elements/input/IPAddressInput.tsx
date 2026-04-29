import InputField from "./InputField";
import { normalizeIpFieldInput } from "../../../../utils/formatIPv4";
import { validateIPAddressWhileTyping } from "../../../../utils/validation/validateIP";

interface IPAddressInputProps {
  label: string;
  value: string;
  onChangeText: (normalized: string) => void;
  /** Ошибка из формы (например после submit); показывается важнее сообщения потоковой проверки. */
  error?: string;
  placeholder?: string;
  size?: "s" | "m";
}

/**
 * Поле IPv4 с десятичной клавиатурой, автоматической вставкой точек после каждых трёх цифр
 * и потоковой валидацией октетов.
 */
export default function IPAddressInput({
  label,
  value,
  onChangeText,
  error,
  placeholder = "192.168.1.1",
  size = "m",
}: IPAddressInputProps) {
  const mergedError =
    error ?? validateIPAddressWhileTyping(value) ?? undefined;

  return (
    <InputField
      label={label}
      value={value}
      onChangeText={(t) => onChangeText(normalizeIpFieldInput(t))}
      error={mergedError}
      placeholder={placeholder}
      size={size}
      keyboardType="decimal-pad"
    />
  );
}
