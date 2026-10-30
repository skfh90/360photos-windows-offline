import { ViewStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;
}

export default () => {
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: "#00140A",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
};
