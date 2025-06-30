import { View, Text } from "react-native";
import EventDetail from "@/components/EventDetail";
import { Event } from "@/services/events";


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
      <View className="flex flex-row">
        <View className="w-1/2 items-center">
          <View className="bg-blue-50 border-2 border-blue-300 rounded-xl shadow-md mx-4 my-4 p-5">
            <View className=" flex flex-col gap-1 items-end ">
              <View className="items-center gap-4">
                <Text className="text-md text-red-500 font-bold">
                  חובשים בדרך
                </Text>
                <Text className="text-3xl text-blue-500 font-bold">
                  {joinedToEvent == 0 ? "1" : joinedToEvent}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="w-1/2 items-center">
          <View className="bg-blue-50 border-2 border-blue-300 rounded-xl shadow-md mx-4 my-4 p-5">
            <View className=" flex flex-col gap-1 items-end ">
              <View className="items-center gap-4">
                <Text className="text-md text-red-500 font-bold">
                  חובשים באירוע
                </Text>
                <Text className="text-3xl text-blue-500 font-bold">
                  {arrivedToEvent}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const items = [{

}];

export default JoinedAndArrivedCard;
