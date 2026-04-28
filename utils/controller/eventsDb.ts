import * as SQLite from 'expo-sqlite';
import type { PercoEvent } from '../../types/events';

export type StoredEventRow = {
  id: number;
  receivedAt: number;
  payloadJson: string;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('perco_events.db');
  return dbPromise;
}

export async function initEventsDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receivedAt INTEGER NOT NULL,
      payloadJson TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_events_receivedAt ON events(receivedAt);
  `);
}

export async function insertEventToDb(event: PercoEvent, receivedAt: number) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO events (receivedAt, payloadJson) VALUES (?, ?)`,
    [receivedAt, JSON.stringify(event)]
  );
}

export async function getRecentEventsFromDb(limit = 500): Promise<Array<{ event: PercoEvent; receivedAt: number }>> {
  const db = await getDb();
  const rows = await db.getAllAsync<StoredEventRow>(
    `SELECT id, receivedAt, payloadJson FROM events ORDER BY receivedAt DESC LIMIT ?`,
    [limit]
  );

  const out: Array<{ event: PercoEvent; receivedAt: number }> = [];
  for (const r of rows) {
    try {
      out.push({ event: JSON.parse(r.payloadJson) as PercoEvent, receivedAt: r.receivedAt });
    } catch {
      // ignore broken row
    }
  }
  // вернуть в хронологическом порядке (старые -> новые)
  return out.reverse();
}

export async function clearEventsDb() {
  const db = await getDb();
  await db.runAsync(`DELETE FROM events`);
}

