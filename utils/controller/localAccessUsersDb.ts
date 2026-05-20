import type { LocalAccessUser } from '../../types/accessUser';
import { getPercoDatabase } from './eventsDb';

/** Trimmed identifiers, synced from DB via `refreshAllowedIdentifiersFromDb`. */
const allowedIdentifiersCache = new Set<string>();

function isUniqueConstraintError(e: unknown): boolean {
  const msg =
    e && typeof e === 'object' && 'message' in e && typeof (e as Error).message === 'string'
      ? (e as Error).message
      : String(e);
  return /unique|constraint/i.test(msg);
}

export function isTrimmedIdentifierAllowed(trimmedId: string): boolean {
  return trimmedId.length > 0 && allowedIdentifiersCache.has(trimmedId);
}

export async function refreshAllowedIdentifiersFromDb(): Promise<void> {
  const db = await getPercoDatabase();
  const rows = await db.getAllAsync<{ identifier: string }>(
    `SELECT identifier FROM local_access_users`,
  );
  allowedIdentifiersCache.clear();
  for (const r of rows) {
    const t = String(r.identifier).trim();
    if (t) allowedIdentifiersCache.add(t);
  }
}

type Row = { id: number; full_name: string; identifier: string };

function rowToUser(r: Row): LocalAccessUser {
  return {
    id: r.id,
    fullName: r.full_name,
    identifier: r.identifier,
  };
}

export async function listLocalAccessUsers(): Promise<LocalAccessUser[]> {
  const db = await getPercoDatabase();
  const rows = await db.getAllAsync<Row>(
    `SELECT id, full_name, identifier FROM local_access_users ORDER BY full_name ASC, id ASC`,
  );
  return rows.map(rowToUser);
}

export async function insertLocalAccessUser(
  fullName: string,
  identifier: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const fn = fullName.trim();
  const idn = identifier.trim();
  if (!fn) return { ok: false, message: 'Укажите ФИО' };
  if (!idn) return { ok: false, message: 'Укажите идентификатор' };
  try {
    const db = await getPercoDatabase();
    await db.runAsync(
      `INSERT INTO local_access_users (full_name, identifier) VALUES (?, ?)`,
      [fn, idn],
    );
    await refreshAllowedIdentifiersFromDb();
    return { ok: true };
  } catch (e: unknown) {
    if (isUniqueConstraintError(e)) {
      return { ok: false, message: 'Пользователь с таким идентификатором уже существует' };
    }
    return { ok: false, message: 'Не удалось добавить пользователя' };
  }
}

export async function updateLocalAccessUser(
  id: number,
  fullName: string,
  identifier: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const fn = fullName.trim();
  const idn = identifier.trim();
  if (!fn) return { ok: false, message: 'Укажите ФИО' };
  if (!idn) return { ok: false, message: 'Укажите идентификатор' };
  try {
    const db = await getPercoDatabase();
    await db.runAsync(
      `UPDATE local_access_users SET full_name = ?, identifier = ? WHERE id = ?`,
      [fn, idn, id],
    );
    await refreshAllowedIdentifiersFromDb();
    return { ok: true };
  } catch (e: unknown) {
    if (isUniqueConstraintError(e)) {
      return { ok: false, message: 'Пользователь с таким идентификатором уже существует' };
    }
    return { ok: false, message: 'Не удалось сохранить изменения' };
  }
}

export async function deleteLocalAccessUser(id: number): Promise<void> {
  const db = await getPercoDatabase();
  await db.runAsync(`DELETE FROM local_access_users WHERE id = ?`, [id]);
  await refreshAllowedIdentifiersFromDb();
}
