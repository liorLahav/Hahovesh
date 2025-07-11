import firestore from '@react-native-firebase/firestore';
import { StatsPeriod } from "./volunteerAnalyticsService";
import {
  calculateDateRange,
  formatWeekday,
  formatHour,
  formatMonthKey,
  formatYear
} from "../app/(app)/statistics/calculations";

/**
 * Helper: normalize any event_date (Firestore Timestamp, ms, sec, ISO string)
 */
function parseEventDate(raw: any): Date {
  if (!raw) return new Date(0);
  if (typeof raw === 'object' && typeof raw.toDate === 'function') {
    return raw.toDate();
  }
  if (typeof raw === 'number') {
    return raw > 1e12 ? new Date(raw) : new Date(raw * 1000);
  }
  if (typeof raw === 'string') {
    const num = Number(raw);
    if (!isNaN(num)) {
      const digits = raw.replace(/^\-/, '').length;
      return digits >= 13 || num > 1e12
        ? new Date(num)
        : new Date(num * 1000);
    }
    const iso = new Date(raw);
    return isNaN(iso.getTime()) ? new Date(0) : iso;
  }
  return new Date(0);
}

/** 1. Total events within date range */
export async function getTotalEvents(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<number> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  let total = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    const include = period === "all"
      ? true
      : ((!start || evDate.getTime() >= start.getTime()) &&
         (!end || evDate.getTime() <= end.getTime()));
    if (include) total++;
  });
  return total;
}

/** 2. Breakdown by transport */
export async function getTransportCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      const key = (d.transport as string || "").trim() || "ללא הובלה";
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

/** 3. Breakdown by receiver */
export async function getReceiverCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      const key = ((d.receiver as string) || "").trim() || "לא ידוע";
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

/** 4. Breakdown by address */
export async function getAddressCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    const include = period === "all"
      ? true
      : ((!start || evDate.getTime() >= start.getTime()) &&
         (!end || evDate.getTime() <= end.getTime()));
    if (include) {
      const key = ((d.address as string) || "").trim() || "לא ידוע";
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

/** 5. Count cases with empty summary */
export async function getNoReportCount(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<number> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  let countNoReport = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      if (((d.summary as string) || "").trim() === "") {
        countNoReport++;
      }
    }
  });
  return countNoReport;
}

/** 6. Breakdown by weekday */
export async function getCountsByWeekday(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      const day = formatWeekday(evDate);
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  return counts;
}

/** 7. Breakdown by hour */
export async function getCountsByHour(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<number, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<number, number> = {};
  for (let h = 0; h < 24; h++) counts[h] = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      counts[evDate.getHours()]++;
    }
  });
  return counts;
}

/** 8. Breakdown by month */
export async function getCountsByMonth(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      const key = formatMonthKey(evDate);
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

/** 9. Breakdown by year */
export async function getCountsByYear(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<number, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const snap = await firestore().collection("eventSummaries").get();
  const counts: Record<number, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);
    if ((period === "all" || evDate.getTime() >= (start?.getTime() ?? 0)) &&
        (period === "all" || evDate.getTime() <= end.getTime())) {
      const year = formatYear(evDate);
      counts[year] = (counts[year] || 0) + 1;
    }
  });
  return counts;
}

/** Count how many volunteers in volunteerStats have at least one event */
export async function getActiveVolunteersCount(): Promise<number> {
  const snap = await firestore().collection("volunteerStats").get();
  let count = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    if ((d.eventsCount || 0) >= 1) count++;
  });
  return count;
}

/** Incrementally update volunteer stats when a single event finishes */
export const updateFinishedEventsCount = async (
  userId: string,
  filledForm: boolean
) => {
  const statsRef = firestore().collection("volunteerStats").doc(userId);
  const statsSnap = await statsRef.get();
  if (statsSnap.exists()) {
    const d = statsSnap.data()!;
    await statsRef.update({
      eventsCount:    (d.eventsCount || 0) + 1,
      summariesCount: (d.summariesCount || 0) + (filledForm ? 1 : 0),
      last_updated:   firestore.FieldValue.serverTimestamp()
    });
  }  
};
