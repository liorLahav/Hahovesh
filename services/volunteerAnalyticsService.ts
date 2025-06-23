// volunteerApi.ts
import { db } from "../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";

import {
  calculateDateRange,
  calculateResponseTime
} from "../app/statistics/calculations";

/** Volunteer for the picker */
export interface Volunteer {
  id: string;
  full_name: string;
}

/** Time-window options */
export type StatsPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "all"
  | "custom";

/** Structure of each volunteer’s stats record */
export interface VolunteerStats {
  id: string;
  name: string;
  eventsCount: number;
  summariesCount: number;
  responseTimeAvg: number;
  formQuality: number;
  events?: Array<{ eventId: string; eventDate: Timestamp }>;
}

/**
 * Load all volunteers for the picker.
 */
export async function fetchVolunteers(): Promise<Volunteer[]> {
  try {
    const snap = await getDocs(collection(db, "volunteers"));
    const list = snap.docs.map(docSnap => {
      const d = docSnap.data();
      const full = `${d.first_name || ""} ${d.last_name || ""}`.trim();
      return { id: docSnap.id, full_name: full };
    });
    return list.sort((a, b) =>
      a.full_name.localeCompare(b.full_name, "he")
    );
  } catch (err) {
    console.error("Error fetching volunteers:", err);
    return [];
  }
}

// Fetch precomputed statistics for a single volunteer.
export async function fetchStatistics(
  period: StatsPeriod,
  selectedFullName?: string,
  startDate?: Date,
  endDate?: Date
) {
  // 1) No volunteer selected → empty result
  if (!selectedFullName) {
    return {
      totalEvents: 0,
      totalSummaries: 0,
      volunteerStats: [] as VolunteerStats[],
      period,
      dateRange: { start: null, end: new Date() }
    };
  }

  // 2) Compute date range
  if (typeof calculateDateRange !== "function") {
    console.error("calculateDateRange is not a function!", calculateDateRange);
    throw new Error("Internal: date-range calculator missing");
  }
  const { start, end } = calculateDateRange(period, startDate, endDate);

  // 3) Query the volunteerStats collection
  const statsQ = query(
    collection(db, "volunteerStats"),
    where("v_full_name", "==", selectedFullName)
  );
  const statsSnap = await getDocs(statsQ);

  // 4) Fallback if no doc exists
  if (statsSnap.empty) {
    return {
      totalEvents: 0,
      totalSummaries: 0,
      volunteerStats: [{
        id: `fallback-${Date.now()}`,
        name: selectedFullName,
        eventsCount: 0,
        summariesCount: 0,
        responseTimeAvg: 0,
        formQuality: 0,
        events: []
      }],
      period,
      dateRange: { start, end }
    };
  }

  // 5) Extract the single document
  const statDoc = statsSnap.docs[0];
  const data = statDoc.data();

  // 6) Ensure events array
  const events: Array<{ eventId: string; eventDate: Timestamp }> =
    Array.isArray(data.events) ? data.events : [];

  // 7) If period === 'all', keep all; otherwise filter to [start,end]
  let filtered = events;
  if (period !== "all" && start !== null) {
    const startMs = start.getTime();
    const endMs = end.getTime();
    filtered = events.filter(e => {
      const ms = e.eventDate.toMillis();
      return ms >= startMs && ms <= endMs;
    });
  }

  // 8) Read counts and compute average response time
  const summariesCount = data.summariesCount || 0;
  const formQuality = data.formQuality || 0;
  const responseTimeAvg = calculateResponseTime(filtered);

  // 9) Return structured result
  return {
    totalEvents: filtered.length,
    totalSummaries: summariesCount,
    volunteerStats: [{
      id: statDoc.id,
      name: data.v_full_name,
      eventsCount: filtered.length,
      summariesCount,
      responseTimeAvg,
      formQuality,
      events: filtered
    }],
    period,
    dateRange: { start, end }
  };
}
