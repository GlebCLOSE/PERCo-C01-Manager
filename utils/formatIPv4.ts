/**
 * Раскладывает только цифры в вид xxx.xxx.xxx.xxx: точка после каждых трёх цифр,
 * если дальше ещё есть цифры и не заполнены все 4 октета.
 */
export function maskIpv4Digits(digitsOnly: string): string {
  const digits = digitsOnly.replace(/\D/g, "").slice(0, 12);
  let out = "";
  let quadIndex = 0;
  let inQuad = 0;
  for (let i = 0; i < digits.length; i++) {
    inQuad++;
    out += digits[i];
    const hasMore = i < digits.length - 1;
    if (inQuad === 3 && hasMore && quadIndex < 3) {
      out += ".";
      quadIndex++;
      inQuad = 0;
    }
  }
  return out;
}

/**
 * Нормализует ввод:
 * - только цифры — маска с точкой после каждых трёх цифр;
 * - октеты разделённые точкой, если каждый сегмент ≤3 цифр и не больше 4-х частей;
 * - точка после неполного октета («172.», «172.17.») сохраняется (раньше срезалась вместе с пустым сегментом);
 * - если сегмент >3 цифр — переходим к полной потоковой маске по всем введённым цифрам.
 */
export function normalizeIpFieldInput(text: string): string {
  const cleaned = text.replace(/[^\d.]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "").slice(0, 12);

  if (cleaned.length === 0) return "";
  if (cleaned.includes("..")) return maskIpv4Digits(digitsOnly);
  /* Ведущая точка без цифр — убираем в маску по цифрам */
  if (cleaned.startsWith(".")) return maskIpv4Digits(digitsOnly);

  /** Пользователь нажал «.» после октета (ещё не ввёл следующий). */
  const userEndedWithDot = cleaned.endsWith(".");
  const core = userEndedWithDot ? cleaned.slice(0, -1) : cleaned;

  if (!core.includes(".")) {
    const masked = maskIpv4Digits(digitsOnly);
    if (userEndedWithDot && masked.length > 0) {
      return `${masked}.`;
    }
    return masked;
  }

  const parts = core.split(".").filter((p) => p.length > 0);
  if (parts.length === 0) return maskIpv4Digits(digitsOnly);
  if (parts.length > 4) return maskIpv4Digits(digitsOnly);

  if (parts.some((p) => !/^\d+$/.test(p))) {
    return maskIpv4Digits(digitsOnly);
  }

  const hasOversizedOctet = parts.some((p) => p.length > 3);
  if (hasOversizedOctet) {
    return maskIpv4Digits(digitsOnly);
  }

  let result = parts.join(".");
  if (userEndedWithDot) {
    result += ".";
  }
  return result;
}
