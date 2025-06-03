
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ConflictMessageProps {
  conflictMessage: string;
  conflictDetails: string;
}

const ConflictMessage = ({ conflictMessage, conflictDetails }: ConflictMessageProps) => {
    const router = useRouter();
    
    return (
        <View className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6 w-full max-w-xl">
          <Text className="text-red-700 text-lg font-bold mb-2 text-right">{conflictMessage}</Text>
          <Text className="text-red-700 text-base mb-3 text-right">{conflictDetails}</Text>
          <TouchableOpacity
            className="bg-blue-700 px-4 py-2 rounded-lg self-end"
            onPress={() => router.push('../Login')}
          >
            <Text className="text-white font-semibold">עבור להתחברות</Text>
          </TouchableOpacity>
        </View>
    )
}
export default ConflictMessage;