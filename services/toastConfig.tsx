import { BaseToast, ErrorToast, ToastProps } from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

export const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", backgroundColor: "#e6ffed" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14 }}
    />
  ),

  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", backgroundColor: "#ffeaea" }}
      text1Style={{ fontSize: 19, fontWeight: "bold" }}
      text2Style={{ fontSize: 13 }}
      renderLeadingIcon={() => (
        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 5 }}>
          <MaterialIcons name="error-outline" size={30} color="red" />
        </View>
      )}
    />
  ),

  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "blue" }}
      text1Style={{ color: "blue" }}
    />
  ),
};
