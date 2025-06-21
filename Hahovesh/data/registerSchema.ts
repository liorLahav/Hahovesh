export type RegisterSchemaField = {
    type: 'text';
    key: string;
    label: string;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'phone-pad';
    numericOnly?: boolean;
    lettersOnly?: boolean;
    maxLength?: number;
    validation?: {
        regex?: RegExp;
        errorMessage: string;
        filter?: (value: string) => string;
    };
};

const registerSchema: RegisterSchemaField[] = [
    {
        type: 'text',
        key: 'firstName',
        label: 'שם פרטי',
        placeholder: 'הכנס שם פרטי (אותיות בלבד)',
        lettersOnly: true,
        validation: {
            regex: /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]*$/,
            errorMessage: 'שם פרטי יכול להכיל רק אותיות',
            filter: (text: string) => text.replace(/[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]/g, '')
        }
    },
    {
        type: 'text',
        key: 'lastName',
        label: 'שם משפחה',
        placeholder: 'הכנס שם משפחה (אותיות בלבד)',
        lettersOnly: true,
        validation: {
            regex: /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]*$/,
            errorMessage: 'שם משפחה יכול להכיל רק אותיות',
            filter: (text: string) => text.replace(/[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]/g, '')
        }
    },
    {
        type: 'text',
        key: 'identifier',
        label: 'תעודת זהות',
        placeholder: 'הכנס תעודת זהות בת 9 ספרות',
        keyboardType: 'numeric',
        numericOnly: true,
        maxLength: 9,
        validation: {
            regex: /^\d{9}$/,
            errorMessage: 'תעודת זהות חייבת להכיל 9 ספרות בדיוק',
            filter: (text: string) => text.replace(/[^\d]/g, '')
        }
    },
    {
        type: 'text',
        key: 'phone',
        label: 'טלפון',
        placeholder: 'הכנס טלפון (05xxxxxxxx)',
        keyboardType: 'phone-pad',
        numericOnly: true,
        maxLength: 10,
        validation: {
            regex: /^05\d{8}$/,
            errorMessage: 'מספר הטלפון חייב להתחיל ב-05 ולהכיל 10 ספרות בדיוק',
            filter: (text: string) => text.replace(/[^\d]/g, '')
        }
    }
];

export default registerSchema;