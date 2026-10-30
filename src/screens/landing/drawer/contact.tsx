/* eslint-disable react/react-in-jsx-scope */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View, TouchableOpacity, Linking, Platform } from "react-native";
import SvgContact from "../../../assets/menu/contactus.svg";
import SvgLeft from "../../../assets/menu/left.svg";
import LinearGradient from "react-native-linear-gradient";
import fonts from "@fonts";
import Clipboard from "@react-native-clipboard/clipboard";

interface IContactProps {
  setPage: (page: number) => void;
  showToast?: (text: string) => void;
}

const Contact: React.FC<IContactProps> = ({ setPage, showToast }) => {
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
          top: Platform.OS == "android" ? 50 : 5,
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
          <SvgContact />
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
          Contact{" "}
        </Text>
      </View>

      <View
        style={{
          width: ScreenWidth,
          height: ScreenHeight - 250,
          marginLeft: 20,
          marginTop: 30,
          // alignItems: "center",
          // justifyContent: "space-between",
          backgroundColor: "#FFF",
        }}
      >
        <Text
          color="rgba(0, 20, 10, 0.50)"
          style={{
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: "300",
            marginBottom: 10,
          }}
        >
          Email
        </Text>
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => Linking.openURL("mailto:360photo@dospace.tech")}
          onLongPress={() => {
            Clipboard.setString("mailto:360photo@dospace.tech");
            showToast("Email address has been copied");
            console.log("clipboard has been copied");
          }}
        >
          <Text
            color="#00140A"
            style={{
              fontSize: 14,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            360photo@dospace.tech
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Contact;
