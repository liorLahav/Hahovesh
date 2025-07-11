import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

type EventDetailProps = {
  headline: string;
  data?: string;
};

const EventDetail: React.FC<EventDetailProps> = ({ headline, data }) => {
  return (
    <View style={tw`mb-3`}>
      <Text style={tw`text-sm text-blue-700 font-bold text-right`}>{headline}</Text>
      <Text style={tw`text-base text-gray-700 text-right`}>{data ?? "לא ידוע"}</Text>
    </View>
  );
};

export default EventDetail;
