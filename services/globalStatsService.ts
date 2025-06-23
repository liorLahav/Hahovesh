import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { StatsPeriod } from "./volunteerAnalyticsService";
import { calculateDateRange, formatWeekday, formatHour, formatMonthKey, formatYear } from "../app/statistics/calculations";

/**
 * 1. COUNT TOTAL EVENTS IN “volunteerStats” COLLECTION WITHIN DATE RANGE
 */
export async function getTotalEvents(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<number> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const statsCol = collection(db, "volunteerStats");
  const statsSnap = await getDocs(statsCol);

  let total = 0;
  statsSnap.forEach(docSnap => {
    const data = docSnap.data();
    const events: Array<{ eventId: string; eventDate: Timestamp }> = Array.isArray(data.events)
      ? data.events
      : [];

    events.forEach(ev => {
      const evDate = ev.eventDate.toDate();

      if (
        (!start || evDate.getTime() >= start.getTime()) &&
        evDate.getTime() <= end.getTime()
      ) {
        total++;
      }
    });
  });

  return total;
}

/**
 * 2. COUNT “transport” BREAKDOWN FROM “eventSummaries” WITHIN DATE RANGE
 */
export async function getTransportCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const transportCounts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);

    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      let tRaw = (d.transport as string || "").trim();
      const key = tRaw === "" ? "ללא הובלה" : tRaw;
      transportCounts[key] = (transportCounts[key] || 0) + 1;
    }
  });

  return transportCounts;
}

/**
 * 3. COUNT “receiver” BREAKDOWN FROM “eventSummaries” WITHIN DATE RANGE
 */
export async function getReceiverCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const receiverCounts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);

    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      let rRaw = (d.receiver as string || "").trim();
      const key = rRaw === "" ? "לא ידוע" : rRaw;
      receiverCounts[key] = (receiverCounts[key] || 0) + 1;
    }
  });

  return receiverCounts;
}

/**
 * 4. CLASSIFICATION BY ADDRESS FROM “eventSummaries” WITHIN DATE RANGE
 */
export async function getAddressCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const addressCounts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);

    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      let aRaw = (d.address as string || "").trim();
      const key = aRaw === "" ? "לא ידוע" : aRaw;
      addressCounts[key] = (addressCounts[key] || 0) + 1;
    }
  });

  return addressCounts;
}

/**
 * 5. COUNT CASES WITH NO REPORT (“summary” EMPTY) IN “eventSummaries” WITHIN DATE RANGE
 */
export async function getNoReportCount(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<number> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  let countNoReport = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);

    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      const summaryText = ((d.summary as string) || "").trim();
      if (summaryText === "") {
        countNoReport++;
      }
    }
  });

  return countNoReport;
}

/**
 * 6. BREAKDOWN BY DAY OF WEEK
 */
export async function getCountsByWeekday(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);
    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      const day = formatWeekday(evDate);
      counts[day] = (counts[day] || 0) + 1;
    }
  });

  return counts;
}

/**
 * 7. BREAKDOWN BY HOUR OF DAY
 */
export async function getCountsByHour(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<number, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const counts: Record<number, number> = {};
  for (let h = 0; h < 24; h++) counts[h] = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);
    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      const h = formatHour(evDate);
      counts[h]++;
    }
  });

  return counts;
}

/**
 * 8. BREAKDOWN BY MONTH
 */
export async function getCountsByMonth(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const counts: Record<string, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);
    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      const key = formatMonthKey(evDate);
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  return counts;
}

/**
 * 9. BREAKDOWN BY YEAR
 */
export async function getCountsByYear(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<number, number>> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);
  const summariesCol = collection(db, "eventSummaries");
  const snap = await getDocs(summariesCol);

  const counts: Record<number, number> = {};
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = new Date(d.event_date as string);
    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end || evDate.getTime() <= end.getTime())
    ) {
      const y = formatYear(evDate);
      counts[y] = (counts[y] || 0) + 1;
    }
  });

  return counts;
}
