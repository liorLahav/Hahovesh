import { collection, getDocs, Timestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { StatsPeriod } from "./volunteerAnalyticsService";
import { calculateDateRange, formatWeekday, formatHour, formatMonthKey, formatYear } from "../app/(app)/statistics/calculations";

function parseEventDate(raw: any): Date {
  if (!raw) return new Date(0);

  // 1) Firestore Timestamp
  if (typeof raw === 'object' && typeof raw.toDate === 'function') {
    return raw.toDate();
  }

  // 2) Numeric (could be ms or sec)
  if (typeof raw === 'number') {
    // If it's larger than ~1e12, assume it's ms
    return raw > 1e12 ? new Date(raw) : new Date(raw * 1000);
  }

  // 3) String
  if (typeof raw === 'string') {
    // Pure‐digit?  
    const num = Number(raw);
    if (!isNaN(num)) {
      // Use string length to decide ms vs sec
      // 13+ digits → ms, 10 digits → secs
      const digits = raw.replace(/^\-/, '').length;
      if (digits >= 13 || num > 1e12) {
        return new Date(num);
      } else {
        return new Date(num * 1000);
      }
    }
    // Fallback: ISO string
    const iso = new Date(raw);
    return isNaN(iso.getTime()) ? new Date(0) : iso;
  }

  // Everything else → epoch
  return new Date(0);
}

/**
 * 1. COUNT TOTAL EVENTS IN “volunteerStats” COLLECTION WITHIN DATE RANGE
 */
export async function getTotalEvents(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<number> {
  const { start, end } = calculateDateRange(period, customStart, customEnd);

  const col = collection(db, "eventSummaries");
  const snap = await getDocs(col);

  let total = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    // normalize Unix-secs, ms, ISO, Timestamp, etc.
    const evDate = parseEventDate(d.event_date);

    // include ALL when period==='all', otherwise within [start,end]
    const include =
      period === "all"
        ? true
        : (
            (!start || evDate.getTime() >= start.getTime()) &&
            (!end   || evDate.getTime() <= end.getTime())
          );

    if (include) {
      total++;
    }
  });

  console.log(`Total events in range: ${total}`);
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
    const evDate = parseEventDate(d.event_date);
    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end   || evDate.getTime() <= end.getTime())
    ) {
      const tRaw = (d.transport as string || "").trim();
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
    const evDate = parseEventDate(d.event_date);

    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end   || evDate.getTime() <= end.getTime())
    ) {
      const raw = ((d.receiver as string) || "").trim();
      const key = raw === "" ? "לא ידוע" : raw;
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
    const evDate = parseEventDate(d.event_date);

    const include =
      period === 'all'
        ? true
        : (
            (!start || evDate.getTime() >= start.getTime()) &&
            (!end   || evDate.getTime() <= end.getTime())
          );

    if (include) {
      const raw = ((d.address as string) || "").trim();
      const key = raw === "" ? "לא ידוע" : raw;
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
    const evDate = parseEventDate(d.event_date);

    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end   || evDate.getTime() <= end.getTime())
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
    // ← normalize Unix‐secs, Firestore Timestamp, ISO, ms, etc.
    const evDate = parseEventDate(d.event_date);

    // ← include only those within your selected window
    if (
      (!start || evDate.getTime() >= start.getTime()) &&
      (!end   || evDate.getTime() <= end.getTime())
    ) {
      // ← map to Hebrew weekday name
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

  // init all 24 hours to zero
  const counts: Record<number, number> = {};
  for (let h = 0; h < 24; h++) counts[h] = 0;

  snap.forEach(docSnap => {
    const d = docSnap.data();
    const evDate = parseEventDate(d.event_date);

    // only filter by date-range when NOT doing “all”
    const include =
      period === "all"
        ? true
        : (
            (!start || evDate.getTime() >= start.getTime()) &&
            (!end   || evDate.getTime() <= end.getTime())
          );
    if (!include) return;

    const hour = evDate.getHours();
    counts[hour] = (counts[hour] || 0) + 1;
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
    // normalize Unix-secs, Timestamp, ISO, ms, etc.
    const evDate = parseEventDate(d.event_date);

    // include all if period==='all', otherwise filter into [start,end]
    const include =
      period === "all"
        ? true
        : (
            (!start || evDate.getTime() >= start.getTime()) &&
            (!end   || evDate.getTime() <= end.getTime())
          );
    if (!include) return;

    const key = formatMonthKey(evDate);  // "YYYY-MM"
    counts[key] = (counts[key] || 0) + 1;
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
    const evDate = parseEventDate(d.event_date);

    // include all if period==='all', otherwise filter by [start,end]
    const include =
      period === "all"
        ? true
        : (
            (!start || evDate.getTime() >= start.getTime()) &&
            (!end   || evDate.getTime() <= end.getTime())
          );
    if (!include) return;

    const year = evDate.getFullYear();
    counts[year] = (counts[year] || 0) + 1;
  });

  return counts;
}


export const updateFinishedEventsCount = async (userId : string, filledForm : boolean) => {
  const statsRef = doc(db, "volunteerStats", userId);
  const statsSnap = await getDoc(statsRef);
  
  if (statsSnap.exists()) {
    const statsData = statsSnap.data();
    const currentEvents = statsData.eventsCount || 0;
    const currentSummaries = statsData.summariesCount || 0;
    
    await updateDoc(statsRef, {
      eventsCount: currentEvents + 1,
      summariesCount: currentSummaries + (filledForm ? 1 : 0),
      last_updated: Timestamp.now()
    });
  } else {
    await updateDoc(statsRef, {
      eventsCount: 1,
      summariesCount: filledForm ? 1 : 0,
      last_updated: Timestamp.now()
    });
  }
}