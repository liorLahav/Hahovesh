import { Timestamp } from 'firebase/firestore';


const TIMESTAMP_KEYS = new Set([
  'event_date',
  'departure_time',
  'arrival_time',
  'end_time',
  'joinedAt',
  'arrivedAt',
]);


export function formatValue(key: string, v: unknown): string {
  if (v === undefined || v === null) return '—';
  if (String(v).trim() === '') return '';

  if (['true', '1', 1, true].includes(v as any))  return 'כן';
  if (['false', '0', 0, false].includes(v as any)) return 'לא';

  if ('female' === v) return 'נקבה';
  if ('male' === v) return 'זכר';

  if (v instanceof Timestamp) return v.toDate().toLocaleString('he-IL');

  const s = String(v).trim();
  if (TIMESTAMP_KEYS.has(key) && /^\d{9,13}$/.test(s)) {
    const n = Number(s);
    const d = new Date(s.length <= 10 ? n * 1000 : n);
    if (!isNaN(d.getTime())) return d.toLocaleString('he-IL');
  }
  return s;
}


export function toDate(raw: any): Date | null {
  if (raw instanceof Timestamp) return raw.toDate();
  const s = String(raw ?? '');
  if (/^\d{9,13}$/.test(s)) {
    const n = Number(s);
    return new Date(s.length <= 10 ? n * 1000 : n);
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}
