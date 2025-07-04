export const FIELD_LABELS: Record<string, string> = {
  name: 'שם מטופל',
  patient_id: 'תעודת זהות מטופל',
  gender: 'מין מטופל',
  phone: 'טלפון',
  address: 'כתובת מגורים',
  event_address: 'כתובת אירוע',
  medical_code: 'קוד רפואי',
  receiver: 'מוקד מקבל',
  event_date: 'תאריך האירוע',
  departure_time: 'זמן יציאה לאירוע',
  arrival_time: 'זמן הגעה לאירוע',
  end_time: 'זמן סיום אירוע',
  event_location: 'מיקום האירוע',
  summary: 'רשומה רפואית (אנמנזה)',
  volenteer_id: 'מספר מתנדב',
  blood_pressure: 'לחץ דם',
  sugar: 'סוכר',
  pulse: 'דופק',
  breath_rate: 'מספר נשימות',
  pulse_state: 'מצב דופק',
  consciousness: 'מצב הכרה',
  breathing: 'מצב נשימה',
  medications: 'תרופות שניתנו',
  oxygen: 'חמצן',
  resuscitation_actions: 'פעולות החייאה',
  special_protocols: 'שימוש בפרוטוקול חריג',
  car_accident: 'מעורבות בתאונת דרכים',
  transport: 'אמצעי פינוי',
  refusal_form: 'טופס סירוב חתום',
  requireRefusalForm: 'דרוש טופס סירוב',
  extra_medics: 'חובשים נוספים',
  additional_notes: 'הערות נוספות',
};


export const READ_ONLY_KEYS = [
  'event_date',
  'departure_time',
  'arrival_time',
  'end_time',
] as const;

export const ORDERED_KEYS = Object.keys(FIELD_LABELS);
