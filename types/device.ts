export interface Device {
  id: string;
  name: string;
  ip: string;
  password: string | null;
  createdAt: string; // ISO-строка даты
}