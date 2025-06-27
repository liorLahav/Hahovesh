// volStatsUpdater.tsx

import { collection, getDocs, getDoc, doc, setDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { calculateFormQuality } from './calculations';

interface VolunteerEvent {
  eventId: string;
  eventDate: Timestamp;
}

type UpdateResult = { volunteersUpdated: number };

async function updateVolunteerStatsFor(volId: string, summaries: any[], full: string) {
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
    if (q > 0) { totalQ += q; count++; }
  });
  const formQuality = count > 0 ? Math.round((totalQ / count) * 10) / 10 : 0;

  // Write back to volunteerStats
  await setDoc(
    doc(db, 'volunteerStats', volId),
    {
      volunteer_id: volId,
      v_full_name: full,
      events,
      eventsCount: events.length,
      summariesCount: summaries.length,
      formQuality,
      last_updated: Timestamp.now()
    },
    { merge: true }
  );

  console.log(`Updated ${full} (${volId}) with ${summaries.length} summaries.`);
}

export async function updateVolunteerStatistics(): Promise<UpdateResult> {
  console.log('Starting volunteer statistics update…');

  const nameToId: Record<string, string> = {};
  const idToName: Record<string, string> = {};
  const volSnap = await getDocs(collection(db, 'volunteers'));
  volSnap.forEach(v => {
    const d = v.data();
    const full = `${d.first_name || ''} ${d.last_name || ''}`.trim();
    if (full) {
      nameToId[full] = v.id;
      idToName[v.id] = full;
    }
  });

  // Ensure each volunteerStats doc exists
  const createPromises = Object.entries(nameToId).map(async ([full, id]) => {
    const statsRef = doc(db, 'volunteerStats', id);
    if (!(await getDoc(statsRef)).exists()) {
      await setDoc(statsRef, {
        volunteer_id: id,
        v_full_name: full,
        events: [] as VolunteerEvent[],
        eventsCount: 0,
        summariesCount: 0,
        formQuality: 0,
        last_updated: Timestamp.now()
      });
      console.log(`Initialized stats for ${full}`);
    }
  });
  await Promise.all(createPromises);

  const sumSnap = await getDocs(collection(db, 'eventSummaries'));
  const grouped: Record<string, any[]> = {};
  sumSnap.forEach(snap => {
    const data = snap.data();
    const volId = data.volenteer_id || data.volunteer_id;
    if (volId) grouped[volId] = grouped[volId] || [], grouped[volId].push(data);
  });

  const updatePromises = Object.entries(grouped).map(([volId, summaries]) => {
    const full = idToName[volId];
    if (!full) {
      console.warn(`Unknown volunteer ID: ${volId}`);
      return Promise.resolve();
    }
    return updateVolunteerStatsFor(volId, summaries, full);
  });

  await Promise.all(updatePromises);

  const updatedCount = updatePromises.length;
  console.log(`✔️ Updated stats for ${updatedCount} volunteers.`);
  return { volunteersUpdated: updatedCount };
}

export async function triggerStatisticsUpdate(): Promise<UpdateResult> {
  return updateVolunteerStatistics();
}
