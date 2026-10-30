/* eslint-disable react/react-in-jsx-scope */
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View } from "react-native";
import SvgGoodDistance from "../../../assets/menu/gooddistance.svg";
import fonts from "@fonts";
import { ratioWidth } from "@shared-constants";

interface IGoodDistanceProps {
  screenHeightRatio: number;
}

const GoodDistance: React.FC<IGoodDistanceProps> = ({ screenHeightRatio }) => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <SvgGoodDistance
        style={{
          position: "absolute",
          width: 290 * ratioWidth,
          height: 190 * ratioWidth,
          top: 135 * screenHeightRatio,
        }}
        width={290 * ratioWidth}
        height={190 * ratioWidth}
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
          Stand 3-5 feet away from
        </Text>

        <Text
          color="#FFF"
          fontFamily={fonts.azosans.light}
          style={{
            fontSize: 18 * ratioWidth,
          }}
        >
          nearby objects or surfaces.
        </Text>

        {/* <Text
          color="#FFF"
          fontFamily={fonts.azosans.light}
          style={{
            fontSize: 18 * ratioWidth,
          }}
        >
          or objects.
        </Text> */}
      </View>
    </View>
  );
};

export default GoodDistance;
