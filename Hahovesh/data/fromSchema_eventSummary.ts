export type SchemaField = {
  key: string;
  label?: string;
  type: 'text' | 'picker' | 'textarea' | 'title' | 'multiselect';
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string;
  required?: boolean;

  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  numericOnly?: boolean;
  lettersOnly?: boolean;
  maxLength?: number;
};

const formSchema_eventSummary: SchemaField[] = [
  { key: 'title_patient', label: 'פרטי מטופל', type: 'title' },
  { key: 'name', label: 'שם המטופל', type: 'text', lettersOnly: true },
  { key: 'patient_id', label: 'ת"ז המטופל', type: 'text', keyboardType: 'numeric', numericOnly: true, maxLength: 9 },
  {
    key: 'gender',
    label: 'מין המטופל',
    type: 'picker',
    options: [
      { label: 'זכר', value: 'male' },
      { label: 'נקבה', value: 'female' }
    ]
  },
  { key: 'phone', label: 'טלפון', type: 'text', keyboardType: 'phone-pad', maxLength: 10 },
  { key: 'address', label: 'כתובת מגורים', type: 'text' },

  { key: 'title_event', label: 'פרטי אירוע', type: 'title' },
  { key: 'event_address', label: 'כתובת האירוע', type: 'text' },
  { key: 'medical_code', label: 'קוד רפואי', type: 'text' },
  {
    key: 'receiver',
    label: 'מוקד מקבל',
    type: 'picker',
    options: [
      { label: 'מד"א', value: 'mada' },
      { label: 'איחוד הצלה', value: 'ihud' },
      { label: 'החובש', value: 'hahovesh' }
    ]
  },
  { key: 'event_date', label: 'תאריך קבלה', type: 'text' },
  { key: 'departure_time', label: 'שעת יציאה', type: 'text' },
  { key: 'arrival_time', label: 'שעת הגעה', type: 'text' },
  { key: 'end_time', label: 'שעת סיום', type: 'text' },

  {
    key: 'event_location',
    label: 'מיקום האירוע',
    type: 'picker',
    options: [
      { label: 'מקום ציבורי', value: 'public' },
      { label: 'בית', value: 'home' },
      { label: 'בית כנסת', value: 'synagogue' },
      { label: 'רחוב', value: 'street' },
      { label: 'בית ספר', value: 'school' }
    ]
  },
  { key: 'summary', label: 'רשומה רפואית (אנמנזה)', type: 'textarea' },

  
  { key: 'title_measurements', label: 'מדדים', type: 'title', },
  { key: 'blood_pressure', label: 'לחץ דם', type: 'text', keyboardType: 'numeric', numericOnly: true, maxLength: 7 },
  { key: 'sugar', label: 'סוכר', type: 'text', keyboardType: 'numeric', numericOnly: true, maxLength: 5 },
  { key: 'pulse', label: 'דופק', type: 'text', keyboardType: 'numeric', numericOnly: true, maxLength: 3 },
  { key: 'breath_rate', label: 'מספר נשימות', type: 'text', keyboardType: 'numeric', numericOnly: true, maxLength: 3 },
  {
    key: 'pulse_state',
    label: 'מצב דופק',
    type: 'picker',
    options: [
      { label: 'סדיר', value: 'סדיר' },
      { label: 'לא סדיר', value: 'לא סדיר' },
      { label: 'ללא דופק', value: 'ללא דופק' }
    ]
  },
  {
    key: 'consciousness',
    label: 'מצב הכרה',
    type: 'picker',
    options: [
      { label: 'הכרה מלאה', value: 'הכרה מלאה' },
      { label: 'מגיב לקול', value: 'מגיב לקול' },
      { label: 'מגיב לכאב', value: 'מגיב לכאב' },
      { label: 'ללא הכרה', value: 'ללא הכרה' }
    ]
  },
  {
    key: 'breathing',
    label: 'מצב נשימה',
    type: 'picker',
    options: [
      { label: 'תקינה', value: 'תקינה' },
      { label: 'קוצר נשימה', value: 'קוצר נשימה' },
      { label: 'ללא נשימה', value: 'ללא נשימה' }
    ]
  },

  { key: 'title_treatment', label: 'טיפולים שניתנו', type: 'title' },
  { key: 'medications', label: 'תרופות שניתנו', type: 'text' },
  {
    key: 'oxygen',
    label: 'חמצן',
    type: 'picker',
    options: [
      { label: 'לא ניתן', value: 'לא ניתן' },
      { label: 'ניתן במסכה', value: 'ניתן במסכה' },
      { label: 'ניתן במשקפיים', value: 'ניתן במשקפיים' },
      { label: 'בוצעה הנשמה', value: 'בוצעה הנשמה' }
    ]
  },
  {
    key: 'resuscitation_actions',
    label: 'החייאה ',
    type: 'multiselect',
    options: [
      { label: 'עיסויי לב', value: 'עיסויי לב' },
      { label: 'הנשמה', value: 'הנשמה' },
      { label: 'שוק חשמלי', value: 'שוק חשמלי' },
      { label: 'מתן תרופות', value: 'מתן תרופות' }
    ]
  },
  { key: 'special_protocols', label: 'שימוש בפרוטוקול חריג', type: 'text' },
  { key: 'car_accident', label: 'תאונת דרכים', type: 'text' },

  { key: 'title_end', label: 'סיום האירוע', type: 'title' },
  {
    key: 'transport',
    label: 'פינוי',
    type: 'picker',
    options: [
      { label: 'פונה באמבולנס', value: 'פונה באמבולנס' },
      { label: 'פונה עצמאית', value: 'פונה עצמאית' },
      { label: 'לא פונה', value: 'לא פונה' }
    ]
  },
  { key: 'refusal_form', label: 'טופס סירוב (אם קיים)', type: 'textarea' },
  { key: 'extra_medics', label: 'שמות חובשים נוספים באירוע', type: 'text' },
  { key: 'additional_notes', label: 'הערות נוספות', type: 'textarea' }
];

export default formSchema_eventSummary;
