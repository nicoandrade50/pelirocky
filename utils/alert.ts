import { Alert } from "react-native";

const showAlert = (message: string) =>
  Alert.alert(
    "Error",
    message,
    [
      {
        text: "Cancel",
        onPress: () => Alert.alert("Cancel Pressed"),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () => Alert.alert(""),
    }
  );

export default showAlert;
