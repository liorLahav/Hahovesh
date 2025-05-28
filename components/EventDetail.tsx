import { View,Text } from "react-native";
type EventDetailProps = {
  headline: String;
  data?: String;
};

const EventDetail = (props: EventDetailProps) => {
  return (
    <View className="mb-3">
      <Text className="text-sm text-blue-700 font-bold text-right">{props.headline}</Text>
      <Text className="text-base text-gray-700 text-right">{props.data ? props.data : "לא ידוע"}</Text>
    </View>
  );
};

export default EventDetail;