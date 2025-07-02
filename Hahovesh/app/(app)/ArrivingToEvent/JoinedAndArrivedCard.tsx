import React from "react";
import { View, Text } from "react-native";
import EventDetail from "@/components/EventDetail";
import { Event } from "@/services/events";
import tw from "twrnc";

type Props = {
  event: Event;
};

const JoinedAndArrivedCard = (props: Props) => {
  const volunteers = Object.values(props.event.volunteers ?? {});
  const joinedToEvent = volunteers.filter(
    (vol) => vol.joinedAt && !vol.arrivedAt
  ).length;
  const arrivedToEvent = volunteers.filter((vol) => vol.arrivedAt).length;

  return (
    <>
      <View style={tw`flex flex-row`}>
        <View style={tw`w-1/2 items-center`}>
          <View style={tw`bg-blue-50 border-2 border-blue-300 rounded-xl shadow-md mx-4 my-4 p-5`}>
            <View style={tw`flex flex-col gap-1 items-end`}>
              <View style={tw`items-center gap-4`}>
                <Text style={tw`text-md text-red-500 font-bold`}>חובשים בדרך</Text>
                <Text style={tw`text-3xl text-blue-500 font-bold`}>{joinedToEvent}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={tw`w-1/2 items-center`}>
          <View style={tw`bg-blue-50 border-2 border-blue-300 rounded-xl shadow-md mx-4 my-4 p-5`}>
            <View style={tw`flex flex-col gap-1 items-end`}>
              <View style={tw`items-center gap-4`}>
                <Text style={tw`text-md text-red-500 font-bold`}>חובשים באירוע</Text>
                <Text style={tw`text-3xl text-blue-500 font-bold`}>{arrivedToEvent}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default JoinedAndArrivedCard;
