export type MessageField = {
  key: string;
  label: string;
  type: "text" | "picker" | "datetime";
  placeholder?: string;
  options?: { label: string; value: string }[];
};

const messageFormSchema: MessageField[] = [
  {
    key: "message_description",
    label: "תוכן ההודעה",
    type: "text",
    placeholder: "...כתוב כאן את תוכן ההודעה",
  },
  {
    key: "distribution_by_role",
    label: "שלח אל",
    type: "picker",
    options: [
      { label: "כולם", value: "All" },
      { label: "חובשים", value: "Volunteers" },
      { label: "מנהלים", value: "Admin" },
      { label: "מוקדנים", value: "Dispatcher" },
    ],
  },
];
export default messageFormSchema;
