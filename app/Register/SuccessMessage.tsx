

import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const SuccessMessage = () => {
    const router = useRouter();
    
    return (
        <View className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6 w-full max-w-xl items-center">
                <Text className="text-green-700 text-lg font-bold mb-2 text-center">
                    ההרשמה התקבלה בהצלחה!
                </Text>
                <Text className="text-green-700 text-base mb-3 text-center">
                    בקשתך נשלחה וממתינה לאישור מנהל. לאחר אישור תוכל להתחבר למערכת.
                </Text>
        </View>
    );
};
                
export default SuccessMessage;