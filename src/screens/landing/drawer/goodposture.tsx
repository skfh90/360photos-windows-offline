/* eslint-disable react/react-in-jsx-scope */
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View } from "react-native";
import SvgGoodPosture from "../../../assets/menu/goodposture.svg";
import fonts from "@fonts";
import { ratioWidth } from "@shared-constants";

interface IGoodPostureProps {
  screenHeightRatio: number;
}

const GoodPosture: React.FC<IGoodPostureProps> = ({ screenHeightRatio }) => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <SvgGoodPosture
        style={{
          position: "absolute",
          width: 240 * ratioWidth,
          height: 175 * ratioWidth,
          top: 162 * screenHeightRatio,
        }}
        width={240 * ratioWidth}
        height={175 * ratioWidth}
      />
      <View
        style={{
          position: "absolute",
          width: ScreenWidth,
          top: 373 * screenHeightRatio,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          color="#FFF"
          fontFamily={fonts.azosans.light}
          style={{
            fontSize: 18 * ratioWidth,
          }}
        >
          Plant your feet and rotate
        </Text>

        <Text
          color="#FFF"
          fontFamily={fonts.azosans.light}
          style={{
            fontSize: 18 * ratioWidth,
          }}
        >
          in one spot.
        </Text>
      </View>
    </View>
  );
};

export default GoodPosture;
