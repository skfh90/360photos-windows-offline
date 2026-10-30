import React from "react";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { ScreenHeight } from "@freakycoder/react-native-helpers";
import SvgLeft from "../../assets/menu/left.svg";
import PolicyContent from "./PolicyContent";
import PolicyText from "./PolicyText";

interface IPolicyProps {
  backAction: () => void;
}

const Policy: React.FC<IPolicyProps> = ({ backAction }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          top: ScreenHeight > 800 ? 50 : 40,
          right: 30,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
        }}
        onPress={() => {
          backAction();
        }}
      >
        <SvgLeft />
      </TouchableOpacity>
      <ScrollView
        style={{
          margin: 20,
          flex: 1,
        }}
      >
        <PolicyText
          style={{
            marginTop: 60,
            textAlign: "center",
            marginBottom: 30,
            fontSize: 16,
          }}
        >
          Privacy Policy
        </PolicyText>
        <PolicyContent />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    // position: "absolute",
    // top: 0,
    // left: 0,
    // width: ScreenWidth,
    // height: ScreenHeight,
    zIndex: 20000000,
  },
});
export default Policy;
