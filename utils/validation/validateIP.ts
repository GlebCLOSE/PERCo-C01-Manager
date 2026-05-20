export const validateIP = (ipAddress: string): string | null => {
  if (!ipAddress.trim()) {
    return "IP‑адрес обязателен";
  }

  const parts = ipAddress.trim().split(".");
  if (parts.length !== 4) {
    return "IP‑адрес должен содержать 4 части, разделённые точками";
  }

  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      return "Каждая часть IP‑адреса должна содержать только цифры";
    }
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) {
      return "Каждая часть IP‑адреса должна быть от 0 до 255";
    }
  }
  return null;
};

/** Проверка при вводе: неполный адрес допустим; полные октеты — 0–255, не больше 4 частей. */
export function validateIPAddressWhileTyping(ip: string): string | null {
  const t = ip.trim();
  if (t === "") return null;

  if (/\.\./.test(t)) {
    return "Укажите корректный IP‑адрес";
  }

  const parts = t.split(".").filter((p) => p.length > 0);
  if (parts.length > 4) {
    return "Слишком много частей";
  }

  for (const p of parts) {
    if (!/^\d+$/.test(p)) {
      return "Каждая часть должна содержать только цифры";
    }
    if (p.length > 3) {
      return "Не больше трёх цифр в части";
    }
    const n = parseInt(p, 10);
    if (n > 255) {
      return "Каждая часть IP‑адреса должна быть от 0 до 255";
    }
  }
  return null;
}
