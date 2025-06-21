import { View, Text } from "react-native";
import EventDetail from "@/components/EventDetail";
import { Event } from "@/services/events";

type EventDetailsCardProps = {
  event: Event;
};

const EventDetailsCard = (props: EventDetailsCardProps) => {
  return (
    <View className="bg-blue-50 border-2 border-blue-300 rounded-xl shadow-md mx-4 my-4 p-5">
      <Text className="text-xl font-bold text-blue-800 text-center mb-3 border-b border-blue-200 pb-2">
        פרטי המטופל
      </Text>
      <View className="space-y-3">
        {props.event.patient_name && (
          <EventDetail headline={"שם המטופל"} data={props.event.patient_name} />
        )}
        {props.event.patient_sex && (
          <EventDetail headline={"מין המטופל"} data={props.event.patient_sex} />
        )}
        {props.event.patient_age && (
          <EventDetail headline={"גיל המטופל"} data={props.event.patient_age} />
        )}
        {props.event.urgency && (
          <EventDetail headline={"דחיפות"} data={props.event.urgency} />
        )}
      </View>
    </View>
  );
};

export default EventDetailsCard;
