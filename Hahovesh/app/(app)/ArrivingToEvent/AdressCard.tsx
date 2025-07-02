import { Pressable, View, Text, Alert } from "react-native";
import { Platform, Linking } from "react-native";
import tw from "twrnc";

type AdressCardProps = {
  address: string;
  addressType?: string;
  apartment_details?: string;
};

const openMapsWithAddress = (event?: { street?: string }) => {
  if (!event || !event.street) return;

  const address = event.street.trim();
  if (!address) return;

  const encodedAddress = encodeURIComponent(address);
  let url = `geo:0,0?q=${encodedAddress}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const browserURL = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        return Linking.openURL(browserURL);
      }
    })
    .catch((err) => {
      console.error("Error opening map:", err);
      Alert.alert("שגיאה", "לא ניתן לפתוח את המפה, נסה שוב מאוחר יותר.");
    });
};

const AdressCard = (props: AdressCardProps) => {
  return (
    <Pressable
      onPress={() => openMapsWithAddress({ street: props.address })}
      style={tw`bg-white mx-4 mt-4 rounded-xl shadow-md overflow-hidden border border-gray-200`}
    >
      <View style={tw`flex-row items-center p-3`}>
        <View style={tw`flex-1`}>  
          <Text style={tw`text-base font-bold text-center`}>מיקום</Text>
          <Text style={tw`text-lg text-gray-700 text-center`}>  
            {props.address}
            {props.addressType && ` (${props.addressType})`}
          </Text>
          {props.apartment_details && (
            <Text style={tw`text-sm text-gray-500 text-center`}>
              {props.apartment_details}
            </Text>
          )}
        </View>
      </View>
      <View style={tw`bg-blue-50 py-2 px-3 border-t border-gray-100`}>
        <Text style={tw`text-sm text-blue-600 font-medium text-center`}>
          לחץ לניווט
        </Text>
      </View>
    </Pressable>
  );
};

export default AdressCard;
