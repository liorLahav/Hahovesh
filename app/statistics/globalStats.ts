import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { StatsPeriod } from "./volApi";
import { calculateDateRange } from "./calculations";

/**
 * 1. COUNT TOTAL EVENTS IN “volunteerStats” COLLECTION WITHIN DATE RANGE
 *
 * Each document in volunteerStats has an “events” array of objects:
 *   { eventId: string, eventDate: Timestamp }
 *
 * We compute the date window via calculateDateRange(period, startDate, endDate),
 * then iterate over all documents in “volunteerStats”, count every eventDate that
 * falls between [start, end].
 */
export async function getTotalEvents(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<number> {
  // 1. Compute the actual date window
  const { start, end } = calculateDateRange(period, customStart, customEnd);

  // 2. Fetch all documents from volunteerStats
  const statsCol = collection(db, "volunteerStats");
  const statsSnap = await getDocs(statsCol);

  let total = 0;
  statsSnap.forEach(docSnap => {
    const data = docSnap.data();
    // data.events is expected to be Array<{ eventId: string; eventDate: Timestamp }>
    const events: Array<{ eventId: string; eventDate: Timestamp }> = Array.isArray(data.events)
      ? data.events
      : [];

    events.forEach(ev => {
      const ts: Timestamp = ev.eventDate;
      const evDate = ts.toDate();
      // Check if within window [start, end]
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
 *
 * The “transport” field can be:
 *   - "נט\"ן"
 *   - "אמבולנס"
 *   - "" (empty string) or something else
 *
 * We will group by whatever string appears, but normalize empty → "ללא הובלה".
 */
export async function getTransportCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  // 1. Compute window
  const { start, end } = calculateDateRange(period, customStart, customEnd);

  // 2. Build Firestore query on eventSummaries by filtering event_date
  const summariesCol = collection(db, "eventSummaries");
  const constraints = [];
  if (start) {
    constraints.push(where("event_date", ">=", Timestamp.fromDate(start)));
  }
  if (end) {
    constraints.push(where("event_date", "<=", Timestamp.fromDate(end)));
  }

  const q =
    constraints.length > 0
      ? query(summariesCol, ...constraints)
      : query(summariesCol);

  const snap = await getDocs(q);

  const transportCounts: Record<string, number> = {};

  snap.forEach(docSnap => {
    const d = docSnap.data();
    let tRaw = (d.transport as string) || "";
    tRaw = tRaw.trim();
    const key = tRaw === "" ? "ללא הובלה" : tRaw;
    transportCounts[key] = (transportCounts[key] || 0) + 1;
  });

  return transportCounts;
}


/**
 * 3. COUNT “receiver” BREAKDOWN (dispatch center) FROM “eventSummaries” WITHIN DATE RANGE
 *
 * The “receiver” field might be:
 *   - "החובש"
 *   - "מד\"א"
 *   - "א\"ה"
 *   - "" or some other string
 *
 * We normalize empty → "לא ידוע".
 */
export async function getReceiverCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  // 1. Compute window
  const { start, end } = calculateDateRange(period, customStart, customEnd);

  // 2. Query eventSummaries
  const summariesCol = collection(db, "eventSummaries");
  const constraints = [];
  if (start) {
    constraints.push(where("event_date", ">=", Timestamp.fromDate(start)));
  }
  if (end) {
    constraints.push(where("event_date", "<=", Timestamp.fromDate(end)));
  }

  const q =
    constraints.length > 0
      ? query(summariesCol, ...constraints)
      : query(summariesCol);

  const snap = await getDocs(q);

  const receiverCounts: Record<string, number> = {};

  snap.forEach(docSnap => {
    const d = docSnap.data();
    let rRaw = (d.receiver as string) || "";
    rRaw = rRaw.trim();
    const key = rRaw === "" ? "לא ידוע" : rRaw;
    receiverCounts[key] = (receiverCounts[key] || 0) + 1;
  });

  return receiverCounts;
}


/**
 * 4. CLASSIFICATION BY ADDRESS FROM “eventSummaries” WITHIN DATE RANGE
 *
 * We group by the “address” field (street + house number). Normalize empty → "לא ידוע".
 */
export async function getAddressCounts(
  period: StatsPeriod,
  customStart?: Date,
  customEnd?: Date
): Promise<Record<string, number>> {
  // 1. Date window
  const { start, end } = calculateDateRange(period, customStart, customEnd);

  // 2. Query
  const summariesCol = collection(db, "eventSummaries");
  const constraints = [];
  if (start) {
    constraints.push(where("event_date", ">=", Timestamp.fromDate(start)));
  }
  if (end) {
    constraints.push(where("event_date", "<=", Timestamp.fromDate(end)));
  }

  const q =
    constraints.length > 0
      ? query(summariesCol, ...constraints)
      : query(summariesCol);

  const snap = await getDocs(q);

  const addressCounts: Record<string, number> = {};

  snap.forEach(docSnap => {
    const d = docSnap.data();
    let aRaw = (d.address as string) || "";
    aRaw = aRaw.trim();
    const key = aRaw === "" ? "לא ידוע" : aRaw;
    addressCounts[key] = (addressCounts[key] || 0) + 1;
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
  // 1. Date window
  const { start, end } = calculateDateRange(period, customStart, customEnd);

  // 2. Query
  const summariesCol = collection(db, "eventSummaries");
  const constraints = [];
  if (start) {
    constraints.push(where("event_date", ">=", Timestamp.fromDate(start)));
  }
  if (end) {
    constraints.push(where("event_date", "<=", Timestamp.fromDate(end)));
  }

  const q =
    constraints.length > 0
      ? query(summariesCol, ...constraints)
      : query(summariesCol);

  const snap = await getDocs(q);

  let countNoReport = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    const summaryText = ((d.summary as string) || "").trim();
    if (summaryText === "") {
      countNoReport++;
    }
  });

  return countNoReport;
}
