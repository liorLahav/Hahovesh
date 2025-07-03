import React from "react";
import { Modal, View, Text, ScrollView, Pressable } from "react-native";

type TermsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function TermsModal({ visible, onClose }: TermsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white w-[90%] max-h-[80%] rounded-2xl p-6">
          <Text className="text-center text-xl font-bold mb-4 text-blue-900">
            תנאי שימוש
          </Text>
          <ScrollView className="mb-4">
            <Text className="text-base text-right leading-relaxed">
              1. השירות הניתן ביישומן (אפליקציה) "צוותי החובש הר נוף" (להלן: "יישומון") נועד למסור מידע לכונני החובש הר נוף, אודות מקרים המתקבלים במוקד החובש הר נוף וכן אמצעי לדיווח על מקרים המוזנים ביישומון.
              {"\n\n"}
              2. המונחים משתמש או לקוח להלן משמעו כל אדם אשר יוצר קשר או מתקשר עם מפתח היישומון ו/או עושה שימוש ביישומון. המידע נכתב בלשון זכר מטעמי נוחות בלבד וכמובן מתייחס לשני המינים.
              {"\n\n"}
              3. השירות מוצע למשתמש כמו שהוא As-Is, מפתחיי היישומון לא ישאו באחריות לטעויות ושגיאות במידע המוצג ביישומון ולא יישאו באחריות לאופן בו המשתמש עושה שימוש במידע.
              {"\n\n"}
              4. המשתמש מסכים לאיסוף ושימוש במידע לרבות מספר הטלפון שלו, וכן נתונים שהוזנו על ידו ביישומון.
              {"\n\n"}
              5. מפתחי היישומון נוקטים אמצעים סבירים להגנת מרבית על פרטיות המשתמש, ולצורך אבטחת המידע הנמסר, בכל מקרה מפתחי היישומון לא יהיו אחראים למקרים של תקלות ו/או שגיאות.
              {"\n\n"}
              6. המשתמש מסיר כל אחריות ועצם השימוש ביישומון מהווה וויתור על כל תביעה ו/או תלונה ו/או דרישה כנגד מפתחי האפליקציה ו/או כנגד ועד החובש הר נוף.
            </Text>
          </ScrollView>
          <Pressable
            onPress={onClose}
            className="bg-blue-700 py-2 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">סגור</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
