/* eslint-disable react/react-in-jsx-scope */
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View, TouchableOpacity, ScrollView, Platform } from "react-native";
import SvgPrivacyPolicy from "../../../assets/menu/privacypolicy.svg";
import SvgLeft from "../../../assets/menu/left.svg";
import LinearGradient from "react-native-linear-gradient";
import fonts from "@fonts";
import PolicyContent from "@shared-components/PolicyContent";
import { BOTTOM_DRAWER_HEIGHT } from "@shared-constants";

interface IPrivacyPolicyProps {
  setPage: (page: number) => void;
}

const PrivacyPolicy: React.FC<IPrivacyPolicyProps> = ({ setPage }) => {
  return (
    <View
      style={{
        width: ScreenWidth,
      }}
    >
      <TouchableOpacity
        style={{
          top: Platform.OS == "android" ? 10 : -40,
          marginTop: Platform.OS == "android" ? 0 : 10,
          padding: 10,
          left: 15,
          width: 50,
          height: 50,
          position: Platform.OS == "android" ? "relative" : "absolute",
        }}
        onPress={() => setPage(0)}
      >
        <SvgLeft />
      </TouchableOpacity>

      <LinearGradient
        locations={[0, 1]}
        colors={["#59d07f", "#4db671"]}
        useAngle={true}
        angle={180}
        style={{
          position: "absolute",
          top: Platform.OS == "android" ? 50 : 8,
          width: "100%",
          left: 0,
          height: 60,
          backgroundColor: "transparent",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 70,
          marginLeft: 20,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#FFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgPrivacyPolicy />
        </View>
        <Text
          fontFamily={fonts.azosans.medium}
          color="#FFF"
          style={{
            marginLeft: 10,
            fontSize: 16,
          }}
        >
          {" "}
          PrivacyPolicy{" "}
        </Text>
      </View>

      <ScrollView
        style={{
          height: BOTTOM_DRAWER_HEIGHT - 160,
          // alignItems: "center",
          // justifyContent: "space-between",
          margin: 10,
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          console.log("touch start");
          e.stopPropagation();
        }}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <PolicyContent />
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
