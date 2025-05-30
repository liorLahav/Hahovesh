import { Timestamp } from 'firebase/firestore';
import { StatsPeriod } from './volApi';

// Calculate date range based on period type
export function calculateDateRange(period: StatsPeriod, startDate?: Date, endDate?: Date): { start: Date | null, end: Date } {
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
      start = null; // All data
  }
  
  console.log(`Calculated date range for ${period}: ${start?.toISOString() || 'all'} to ${now.toISOString()}`);
  return { start, end: now };
}

/**
 * Function to calculate average response time (for future use)
 * Currently returns a constant value as an example
 */
export function calculateResponseTime(events: Array<{ eventId: string, eventDate: Timestamp }>): number {
  // In the future, we can calculate the actual response time based on event data
  // For example: the difference between "taking the event" time and the volunteer's initial arrival time
  return 15; // Constant value in minutes
}

/**
 * Function to calculate form completion quality
 * The function checks how many fields of the form were filled, with emphasis on critical fields
 * @param summaryData The summary object from Firestore
 * @returns Quality score between 1-10
 */
export function calculateFormQuality(summaryData: any): number {
  if (!summaryData) return 0;
  
  // All fields in the form
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
  
  // Critical fields that have a significant impact on the form's quality
  const criticalFields = [
    'consciousness', 'breathing', 'pulse', 'oxygen', 'summary', 
    'blood_pressure', 'breath_rate', 'medications'
  ];
  
  // Titles of the fields that are not relevant for the quality calculation
  const titleFields = [
    'title_end', 'title_event', 'title_measurements', 'title_medic',
    'title_patient', 'title_treatment'
  ];
  
  // List of all fields that are relevant for the quality calculation
  const relevantFields = allFields.filter(field => !titleFields.includes(field));
  
  // Counting how many fields are filled
  let filledCount = 0;
  let criticalFilledCount = 0;
  let totalCriticalFields = 0;
  
  for (const field of relevantFields) {
    // Check if the field has a value (not empty, not null, not undefined)
    const hasValue = summaryData[field] !== undefined && 
                     summaryData[field] !== null && 
                     summaryData[field] !== '';
    
    if (hasValue) {
      filledCount++;
      
      // If it's a critical field, count it separately
      if (criticalFields.includes(field)) {
        criticalFilledCount++;
      }
    }
    
    // Count how many critical fields exist in the form
    if (criticalFields.includes(field)) {
      totalCriticalFields++;
    }
  }
  
  /* Calculate the score:
   60% of the score is based on the percentage of regular fields filled
   40% of the score is based on the percentage of critical fields filled
   */
  const regularFieldsWeight = 0.6;
  const criticalFieldsWeight = 0.4;
  
  const regularFieldsCount = relevantFields.length - totalCriticalFields;
  const regularFieldsFilled = filledCount - criticalFilledCount;
  
  const regularScore = regularFieldsCount > 0 
    ? (regularFieldsFilled / regularFieldsCount) * 10 * regularFieldsWeight 
    : 0;
    
  const criticalScore = totalCriticalFields > 0
    ? (criticalFilledCount / totalCriticalFields) * 10 * criticalFieldsWeight
    : 0;
  
  // Calculate the final score (between 1-10)
  let finalScore = regularScore + criticalScore;
  
  // Give a bonus for detailed summaries (more than 15 characters)
  if (summaryData.summary && typeof summaryData.summary === 'string') {
    if (summaryData.summary.length > 50) {
      finalScore += 1; // Large bonus for very detailed summaries
    } else if (summaryData.summary.length > 15) {
      finalScore += 0.5; // Partial bonus for medium-length summaries
    }
  }
  
  // Ensure the score is within the range 1-10
  finalScore = Math.max(1, Math.min(10, finalScore));
  
  // Round to one decimal place
  return Math.round(finalScore * 10) / 10;
}