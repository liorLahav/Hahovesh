// services/volunteerAnalyticsService.ts

import { db } from "../FirebaseConfig";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { calculateDateRange, calculateResponseTime } from "../app/(app)/statistics/calculations";
import { fetchEventSummaries } from "./event_summary";
export interface Volunteer {
  id: string;
  full_name: string;
}

export type StatsPeriod =
  | "daily" | "weekly" | "monthly" | "yearly" | "all" | "custom";

export interface VolunteerStats {
  id: string;
  name: string;
  eventsCount: number;
  summariesCount: number;
  responseTimeAvg: number;
  formQuality: number;
  events?: Array<{ eventId: string; eventDate: Timestamp }>;
}

/** Load all volunteers for the picker */
export async function fetchVolunteers(): Promise<Volunteer[]> {
  try {
    const snap = await getDocs(collection(db, "volunteers"));
    const list = snap.docs.map(docSnap => {
      const d = docSnap.data();
      return {
        id:   docSnap.id,
        full_name: `${d.first_name || ""} ${d.last_name || ""}`.trim()
      };
    });
    return list.sort((a, b) => a.full_name.localeCompare(b.full_name, "he"));
  } catch (err) {
    console.error("Error fetching volunteers:", err);
    return [];
  }
}

/**
 * Fetch precomputed stats for one volunteer by ID.
 */
export async function fetchStatistics(
  period: StatsPeriod,
  userId: string,
  selectedFullName?: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalEvents: number;
  totalSummaries: number;
  volunteerStats: VolunteerStats[];
  period: StatsPeriod;
  dateRange: { start: Date | null; end: Date };
}> {
  if (!selectedFullName) {
    return {
      totalEvents: 0,
      totalSummaries: 0,
      volunteerStats: [],
      period,
      dateRange: { start: null, end: new Date() }
    };
  }

  const { start, end } = calculateDateRange(period, startDate, endDate);

  // Query the single stats doc
  const statsQ = query(
    collection(db, "volunteerStats"),
    where("volunteer_id", "==", userId)
  );
  const statsSnap = await getDocs(statsQ);

  if (statsSnap.empty) {
    return {
      totalEvents:    0,
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

  const statDoc = statsSnap.docs[0];
  const data = statDoc.data();
  const events: Array<{ eventId: string; eventDate: Timestamp }> =
    Array.isArray(data.events) ? data.events : [];

  // If filtering by range, drop out‐of‐range events
  let filtered = events;
  if (period !== "all" && start) {
    const startMs = start.getTime();
    const endMs   = end.getTime();
    filtered = events.filter(e => {
      const ms = e.eventDate.toMillis();
      return ms >= startMs && ms <= endMs;
    });
  }

  const responseTimeAvg = calculateResponseTime(userId, await fetchEventSummaries());

  return {
    totalEvents:    filtered.length,
    totalSummaries: data.summariesCount || 0,
    volunteerStats: [{
      id:            statDoc.id,
      name:          data.v_full_name,
      eventsCount:   data.eventsCount || 0,
      summariesCount:data.summariesCount || 0,
      responseTimeAvg,
      formQuality:   data.formQuality || 0,
      events:        filtered
    }],
    period,
    dateRange: { start, end }
  };
}

/**
 * NEW: Fetch volunteerStats by volunteer full-name.
 * Moves the Firestore query out of the UI.
 */
export async function fetchVolunteerStatsByName(
  selectedFullName: string
): Promise<VolunteerStats[]> {
  const statsQ = query(
    collection(db, "volunteerStats"),
    where("v_full_name", "==", selectedFullName)
  );
  const snap = await getDocs(statsQ);
  if (snap.empty) return [];
  return snap.docs.map(docSnap => {
    const d = docSnap.data();
    return {
      id:            docSnap.id,
      name:          d.v_full_name,
      eventsCount:   d.eventsCount || 0,
      summariesCount:d.summariesCount || 0,
      responseTimeAvg:d.responseTimeAvg || 0,
      formQuality:   d.formQuality || 0,
      events:        d.events || []
    };
  });
}
