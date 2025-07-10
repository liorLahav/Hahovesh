// volStatsUpdater.tsx

import pLimit from 'p-limit';
import firestore from '@react-native-firebase/firestore';
import { calculateFormQuality } from './calculations';

interface VolunteerEvent {
  eventId: string;
  eventDate: firestore.Timestamp;
}

type UpdateResult = { volunteersUpdated: number };

// Firestore instance (namespaced API)
const db = firestore();

async function updateVolunteerStatsFor(
  volId: string,
  summaries: any[],
  full: string
) {
  console.log(`🔄 Processing ${full} (${volId}) with ${summaries.length} summaries`);

  // Parse and collect events
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
    return { eventId: s.eventId, eventDate: firestore.Timestamp.fromDate(date) };
  });

  // Compute average formQuality
  let totalQ = 0;
  let count = 0;
  summaries.forEach(s => {
    const q = calculateFormQuality(s);
    if (q > 0) {
      totalQ += q;
      count++;
    }
  });
  const formQuality = count > 0 ? Math.round((totalQ / count) * 10) / 10 : 0;

  // Upsert stats doc
  await db.collection('volunteerStats').doc(volId).set(
    {
      volunteer_id: volId,
      v_full_name: full,
      events,
      eventsCount: events.length,
      summariesCount: summaries.length,
      formQuality,
      last_updated: firestore.Timestamp.now()
    },
    { merge: true }
  );

  console.log(`✅ Stats updated for ${full} (${volId})`);
}

export async function updateVolunteerStatistics(): Promise<UpdateResult> {
  console.log('🚀 Starting volunteer statistics update…');

  // 1. Load volunteers
  const nameToId: Record<string, string> = {};
  const idToName: Record<string, string> = {};
  const volSnap = await db.collection('volunteers').get();
  volSnap.forEach(docSnap => {
    const data = docSnap.data();
    const full = `${data.first_name || ''} ${data.last_name || ''}`.trim();
    if (full) {
      nameToId[full] = docSnap.id;
      idToName[docSnap.id] = full;
    }
  });
  console.log(`🔍 ${Object.keys(nameToId).length} volunteers found`);

  // 2. Initialize missing stats docs in batches
  const statsSnap = await db.collection('volunteerStats').get();
  const existingIds = new Set(statsSnap.docs.map(d => d.id));
  const missing = Object.entries(nameToId)
    .filter(([_full, id]) => !existingIds.has(id))
    .map(([full, id]) => ({ full, id }));
  console.log(`🆕 Initializing ${missing.length} new stats docs`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = db.batch();
    missing.slice(i, i + BATCH_SIZE).forEach(({ full, id }) => {
      const ref = db.collection('volunteerStats').doc(id);
      batch.set(ref, {
        volunteer_id: id,
        v_full_name: full,
        events: [] as VolunteerEvent[],
        eventsCount: 0,
        summariesCount: 0,
        formQuality: 0,
        last_updated: firestore.Timestamp.now()
      });
      console.log(`  📝 Queued init for ${full}`);
    });
    await batch.commit();
    console.log(`  📦 Committed batch ${i + 1}-${Math.min(i + BATCH_SIZE, missing.length)}`);
  }
  console.log('✅ All missing stats initialized');

  // 3. Load summaries and group by volId
  const sumSnap = await db.collection('eventSummaries').get();
  const grouped: Record<string, any[]> = {};
  sumSnap.forEach(snap => {
    const data = snap.data();
    const volId = data.volenteer_id || data.volunteer_id;
    if (volId) {
      grouped[volId] = grouped[volId] || [];
      grouped[volId].push(data);
    }
  });
  console.log(`🔄 Summaries found for ${Object.keys(grouped).length} volunteers`);

  // 4. Update stats with limited concurrency
  const limit = pLimit(10);
  await Promise.all(
    Object.entries(grouped).map(([volId, summaries]) =>
      limit(async () => {
        const full = idToName[volId];
        if (!full) {
          console.warn(`⚠️ Unknown volunteer ID: ${volId}`);
          return;
        }
        await updateVolunteerStatsFor(volId, summaries, full);
      })
    )
  );

  const updatedCount = Object.keys(grouped).length;
  console.log(`🎉 Finished updating ${updatedCount} volunteer stats`);
  return { volunteersUpdated: updatedCount };
}

export async function triggerStatisticsUpdate(): Promise<UpdateResult> {
  return updateVolunteerStatistics();
}