// calculations.ts
import { Timestamp } from 'firebase/firestore';
import { StatsPeriod } from ".../../services/volunteerAnalyticsService";
import { getEventSummary } from '@/services/event_summary';

// Calculate date range based on period type
export function calculateDateRange(
  period: StatsPeriod,
  startDate?: Date,
  endDate?: Date
): { start: Date | null; end: Date } {
  if (period === 'custom' && startDate) {
    return { start: startDate, end: endDate || new Date() };
  }

  const now = new Date();
  let start: Date | null = null;
  switch (period) {
    case 'daily':
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'yearly':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      start = null;
  }
  return { start, end: now };
}

// Helper: weekday names in Hebrew
export const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export function formatWeekday(date: Date): string {
  return dayNames[date.getDay()];
}

export function formatHour(date: Date): number {
  return date.getHours();
}

export function formatMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

export function formatYear(date: Date): number {
  return date.getFullYear();
}

export function calculateResponseTime(
  targetVolunteerId: string,
  events : any
): number {
  try{
  if (!events || events.length === 0) return 0;
  let totalResponseTime = 0;
  let eventCount = 0;

  for (const event of events) {
    const volunteerEntry = event.volunteer_times?.[targetVolunteerId];
    if (
      volunteerEntry &&
      volunteerEntry.arrivedAt &&
      volunteerEntry.joinedAt &&
      volunteerEntry.arrivedAt > volunteerEntry.joinedAt
    ) {
      totalResponseTime += volunteerEntry.arrivedAt - volunteerEntry.joinedAt;
      eventCount += 1;
    }
  }

  if (eventCount === 0) return 0;
  console.log(`Total response time for ${targetVolunteerId}: ${totalResponseTime} ms over ${eventCount} events`);
  return totalResponseTime / eventCount;
  } catch (error) {
    console.error("Error calculating volunteer response time:", error);
    return 0;
  }
}

// Function to calculate form completion quality
export function calculateFormQuality(summaryData: any): number {
  if (!summaryData) return 0;
  const allFields = [
    'additional_notes', 'address', 'arrival_time', 'blood_pressure',
    'breath_rate', 'breathing', 'car_accident', 'consciousness',
    'departure_time', 'end_time', 'eventId', 'event_address',
    'event_date', 'event_location', 'extra_medics', 'gender',
    'id', 'medic_code', 'medic_name', 'medical_code',
    'medications', 'name', 'oxygen', 'phone',
    'pulse', 'pulse_state', 'receiver', 'refusal_form',
    'resuscitation_actions', 'special_protocols', 'sugar', 'summary',
    'title_end', 'title_event', 'title_measurements', 'title_medic',
    'title_patient', 'title_treatment', 'transport'
  ];
  const criticalFields = [
    'consciousness', 'breathing', 'pulse', 'oxygen', 'summary',
    'blood_pressure', 'breath_rate', 'medications'
  ];
  const titleFields = [
    'title_end', 'title_event', 'title_measurements', 'title_medic',
    'title_patient', 'title_treatment'
  ];
  const relevantFields = allFields.filter(f => !titleFields.includes(f));

  let filledCount = 0;
  let criticalFilledCount = 0;
  let totalCritical = 0;
  relevantFields.forEach(field => {
    const has = summaryData[field] !== undefined && summaryData[field] !== null && summaryData[field] !== '';
    if (has) {
      filledCount++;
      if (criticalFields.includes(field)) criticalFilledCount++;
    }
    if (criticalFields.includes(field)) totalCritical++;
  });
  const regularCount = relevantFields.length - totalCritical;
  const regularScore = regularCount > 0 ? (filledCount - criticalFilledCount) / regularCount * 10 * 0.6 : 0;
  const criticalScore = totalCritical > 0 ? (criticalFilledCount / totalCritical) * 10 * 0.4 : 0;
  let score = regularScore + criticalScore;
  if (typeof summaryData.summary === 'string') {
    if (summaryData.summary.length > 50) score += 1;
    else if (summaryData.summary.length > 15) score += 0.5;
  }
  return Math.round(Math.max(1, Math.min(10, score)) * 10) / 10;
}
