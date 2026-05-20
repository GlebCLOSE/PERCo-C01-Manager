/** Максимум uint24 (3 байта без знака). */
export const UINT24_MAX = 0xff_ff_ff;

const DigitsOnly = /^\d+$/;

/**
 * Разбирает строку идентификатора как целое 0..UINT24_MAX.
 * Допускаются только ASCII-цифры (после trim пустая строка — не валидна).
 */
export function parseUint24Identifier(trimmed: string): number | null {
  if (!trimmed || !DigitsOnly.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isSafeInteger(n) || n < 0 || n > UINT24_MAX) return null;
  return n;
}

/** Строка для QR: десятичное представление с ведущими нулями (по умолчанию 10 символов). */
export function formatIdentifierForQr(value: number, digitWidth = 10): string {
  if (!Number.isInteger(value) || value < 0 || value > UINT24_MAX) {
    throw new RangeError('formatIdentifierForQr: value out of uint24 range');
  }
  return String(value).padStart(digitWidth, '0');
}
