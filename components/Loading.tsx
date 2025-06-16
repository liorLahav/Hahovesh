import { View,Text } from "react-native";

type LoadingProps = {
    message?: string;
};

const Loading = ({ message = "טוען..." }: LoadingProps) => {
    return (
        <View className="flex-1 items-center justify-center">
        <Text>{message ? message : "טוען..."}</Text>
        </View>
    );
}

export default Loading;