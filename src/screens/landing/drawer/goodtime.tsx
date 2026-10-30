/* eslint-disable react/react-in-jsx-scope */
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View } from "react-native";
import fonts from "@fonts";
import { ratioHeight } from "@shared-constants";

interface IGoodTimeProps {}

const GoodTime: React.FC<IGoodTimeProps> = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 20,
        height: 220,
        // justifyContent: "space-around",
      }}
    >
      <Text
        color="#FFF"
        style={{
          fontSize: 24,
          fontWeight: "600",
          letterSpacing: 1.2,
        }}
      >
        GOOD TIME.
      </Text>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: 60 * ratioHeight,
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 100,
              backgroundColor: "#FFF",
              marginRight: 10,
              marginTop: 10,
            }}
          ></View>
          <View>
            <Text
              color="#FFF"
              fontFamily={fonts.azosans.light}
              style={{
                fontSize: 18,
              }}
            >
              Set aside about 2 minutes.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: 20,
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 100,
              backgroundColor: "#FFF",
              marginRight: 10,
              marginTop: 10,
            }}
          ></View>
          <View>
            <Text
              color="#FFF"
              fontFamily={fonts.azosans.light}
              style={{
                fontSize: 18,
              }}
            >
              Check the map at the bottom of
            </Text>
            <Text
              color="#FFF"
              fontFamily={fonts.azosans.light}
              style={{
                fontSize: 18,
              }}
            >
              your screen to track your progress.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GoodTime;
