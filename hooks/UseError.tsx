import { useState } from "react";
import Toast from "react-native-toast-message";

export function useError() {
  const [error, setError] = useState<string | null>(null);

  const cleanError = () => {
    setError(null);
  };

  const setErrorMessage = (message: string) => {
    setError(message);

    Toast.show({
      type: "error", // "success" | "error" | "info" | מותאם אישית
      text1: message,
      position: "top", // או "bottom"
      visibilityTime: 4000, // משך הופעה במילישניות
      autoHide: true, // האם להיעלם אוטומטית
      topOffset: 800, // מרחק מהחלק העליון             
      onPress: () => {
        Toast.hide();
      },
    });
  };

  return {
    error,
    cleanError,
    setErrorMessage,
  };
}
