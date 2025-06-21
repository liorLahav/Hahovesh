import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, getDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { calculateFormQuality } from './calculations';

interface VolunteerEvent {
  eventId: string;
  eventDate: Timestamp;
}

// Aggregate all eventSummaries → volunteerStats
export async function updateVolunteerStatistics() {
  console.log('Starting volunteer statistics update…');

  // First we will load volunteers into name → ID map
  const nameToId: Record<string,string> = {};
  const volSnap = await getDocs(collection(db, 'volunteers'));
  volSnap.forEach(v => {
    const d = v.data();
    const full = `${d.first_name||''} ${d.last_name||''}`.trim();
    if (full) nameToId[full] = v.id;
  });

  // Then we ensure each volunteer has an initial stats doc
  for (const [full, id] of Object.entries(nameToId)) {
    const ref = doc(db, 'volunteerStats', id);
    if (!(await getDoc(ref)).exists()) {
      await setDoc(ref, {
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

  // Read & group all summaries
  const sumSnap = await getDocs(collection(db, 'eventSummaries'));
  const byName: Record<string, any[]> = {};
  sumSnap.forEach(s => {
    const data = s.data();
    if (data.medic_name) {
      (byName[data.medic_name] ||= []).push(data);
    }
  });

  // Build & write aggregated stats
  let updatedCount = 0;
  for (const [full, sums] of Object.entries(byName)) {
    const volId = nameToId[full];
    if (!volId) {
      console.warn(`Skipping unknown volunteer "${full}"`);
      continue;
    }

    // --- SAFE DATE PARSING HERE ---
    const events: VolunteerEvent[] = sums.map(s => {
      let jsDate: Date;
      if (typeof s.event_date === 'string') {
        const d = new Date(s.event_date);
        jsDate = isNaN(d.getTime()) ? new Date() : d;
      } else if (s.event_date && typeof s.event_date.toDate === 'function') {
        jsDate = s.event_date.toDate();
      } else {
        jsDate = new Date();
      }
      return {
        eventId:   s.eventId,
        eventDate: Timestamp.fromDate(jsDate)
      };
    });

    // compute formQuality
    let totalQ = 0, countQ = 0;
    sums.forEach(s => {
      const q = calculateFormQuality(s);
      if (q > 0) { totalQ += q; countQ++; }
    });
    const formQuality = countQ > 0
      ? Math.round((totalQ / countQ) * 10) / 10
      : 0;

    // write/update
    await setDoc(
      doc(db, 'volunteerStats', volId),
      {
        volunteer_id:   volId,
        v_full_name:    full,
        events,
        eventsCount:    events.length,
        summariesCount: sums.length,
        formQuality,
        last_updated:   Timestamp.now()
      },
      { merge: true }
    );

    console.log(`Stats written for ${full} (${volId})`);
    updatedCount++;
  }

  console.log(`✔️ Updated stats for ${updatedCount} volunteers.`);
  return { volunteersUpdated: updatedCount };
}

// Simple UI to trigger the above from the app.
export default function UpdateCollectionScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleUpdate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { volunteersUpdated } = await updateVolunteerStatistics();
      setResult({ success: true, message: `עודכנו נתונים עבור ${volunteersUpdated} מתנדבים!` });
    } catch (e: any) {
      setResult({ success: false, message: `שגיאה בעדכון: ${e.message || e}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-100 p-4">
      <View className="bg-white rounded-lg p-5 shadow-md">
        <Text className="text-xl font-bold text-blue-800 mb-4 text-center">
          עדכון סטטיסטיקות מתנדבים
        </Text>
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          className={`py-3 px-6 rounded-lg items-center ${loading ? 'bg-gray-400' : 'bg-blue-700'}`}
        >
          {loading
            ? <ActivityIndicator color="white" size="small"/>
            : <Text className="text-white font-bold text-lg">עדכן סטטיסטיקות</Text>}
        </TouchableOpacity>
        {result && (
          <View className={`mt-5 p-3 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`${result.success ? 'text-green-800' : 'text-red-800'} text-right`}>
              {result.message}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Exposed for use in other components
export async function triggerStatisticsUpdate() {
  return updateVolunteerStatistics();
}