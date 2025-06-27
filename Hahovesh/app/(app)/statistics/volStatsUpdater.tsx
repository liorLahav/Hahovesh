// volStatsUpdater.tsx
import React from 'react';
import { collection, getDocs, getDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { calculateFormQuality } from './calculations';

interface VolunteerEvent {
  eventId: string;
  eventDate: Timestamp;
}

type UpdateResult = { volunteersUpdated: number };

/**
 * Scans all eventSummaries, recalculates each volunteer's formQuality,
 * and writes the updated score into volunteerStats.
 */
export async function updateVolunteerStatistics(): Promise<UpdateResult> {
  console.log('Starting volunteer statistics update…');

  // 1) Load volunteers: build fullName↔id maps
  const nameToId: Record<string,string> = {};
  const idToName: Record<string,string> = {};
  const volSnap = await getDocs(collection(db, 'volunteers'));
  volSnap.forEach(v => {
    const d = v.data();
    const full = `${d.first_name||''} ${d.last_name||''}`.trim();
    if (full) {
      nameToId[full] = v.id;
      idToName[v.id] = full;
    }
  });

  // 2) Ensure each volunteerStats doc exists (seed if missing)
  for (const [full, id] of Object.entries(nameToId)) {
    const statsRef = doc(db, 'volunteerStats', id);
    if (!(await getDoc(statsRef)).exists()) {
      await setDoc(statsRef, {
        volunteer_id:   id,
        v_full_name:    full,
        events:         [] as VolunteerEvent[],
        eventsCount:    0,
        summariesCount: 0,
        formQuality:    0,
        last_updated:   Timestamp.now()
      });
      console.log(`Initialized stats for ${full}`);
    }
  }

  // 3) Read & group all summaries by volunteer ID
  const sumSnap = await getDocs(collection(db, 'eventSummaries'));
  const grouped: Record<string, any[]> = {};
  sumSnap.forEach(snap => {
    const data = snap.data();
    // Use the actual field name in your summaries
    const volId = data.volenteer_id || data.volunteer_id;
    if (volId) grouped[volId] = grouped[volId] || [], grouped[volId].push(data);
  });

  // 4) Compute & write updated stats
  let updatedCount = 0;
  for (const [volId, summaries] of Object.entries(grouped)) {
    const full = idToName[volId];
    if (!full) {
      console.warn(`Unknown volunteer ID: ${volId}`);
      continue;
    }

    // Parse events
    const events: VolunteerEvent[] = summaries.map(s => {
      let date: Date;
      if (typeof s.event_date === 'string') {
        const d = new Date(s.event_date);
        date = isNaN(d.getTime()) ? new Date() : d;
      } else if (s.event_date?.toDate) {
        date = s.event_date.toDate();
      } else {
        date = new Date();
      }
      return { eventId: s.eventId, eventDate: Timestamp.fromDate(date) };
    });

    // Calculate average formQuality
    let totalQ = 0, count = 0;
    summaries.forEach(s => {
      const q = calculateFormQuality(s);
      console.log(`Summary ${s.eventId} → Q=${q}`);
      if (q > 0) { totalQ += q; count++; }
    });
    const formQuality = count > 0 ? Math.round((totalQ/count)*10)/10 : 0;
    console.log(`Volunteer ${volId} avg Q=${formQuality}`);

    // Write back to volunteerStats
    await setDoc(
      doc(db, 'volunteerStats', volId),
      {
        volunteer_id:   volId,
        v_full_name:    full,
        events,
        eventsCount:    events.length,
        summariesCount: summaries.length,
        formQuality,
        last_updated:   Timestamp.now()
      },
      { merge: true }
    );
    updatedCount++;
  }

  console.log(`✔️ Updated stats for ${updatedCount} volunteers.`);
  return { volunteersUpdated: updatedCount };
}

/**
 * Convenience wrapper for UI components.
 */
export async function triggerStatisticsUpdate(): Promise<UpdateResult> {
  return updateVolunteerStatistics();
}
