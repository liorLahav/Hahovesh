import { Button } from "@/components/Button";
import { View } from "react-native";
export default function Buttons() {
    return (
        <View className="flex-row items-center justify-center gap-20 w-full px-4 py-2 mt-20">
            <Button
                label={"הצג מיקום"}
                onPress={() => {}}
                variant="default"
                size="default"
            />
            <Button
                label={"הצג מיקום"}
                onPress={() => {}}
                variant="default"
                size="default"
            />
        </View>
    );

}