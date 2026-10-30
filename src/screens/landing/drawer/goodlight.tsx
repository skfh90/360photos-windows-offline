/* eslint-disable react/react-in-jsx-scope */
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View } from "react-native";
import SvgGoodLight from "../../../assets/menu/goodlight.svg";
import fonts from "@fonts";
import { ratioWidth } from "@shared-constants";

interface IGoodLightProps {
  screenHeightRatio: number;
}

const GoodLight: React.FC<IGoodLightProps> = ({ screenHeightRatio }) => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <SvgGoodLight
        style={{
          position: "absolute",
          width: 247 * ratioWidth,
          height: 140 * ratioWidth,
          top: 162 * screenHeightRatio,
        }}
        width={247 * ratioWidth}
        height={140 * ratioWidth}
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
          If indoors, turn on lights and
        </Text>

        <Text
          color="#FFF"
          fontFamily={fonts.azosans.light}
          style={{
            fontSize: 18 * ratioWidth,
          }}
        >
          open your blinds and curtains.
        </Text>
      </View>
    </View>
  );
};

export default GoodLight;
