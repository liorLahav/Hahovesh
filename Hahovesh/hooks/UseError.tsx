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
      type: "error",
      text1: "שגיאה!",
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 800,
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
