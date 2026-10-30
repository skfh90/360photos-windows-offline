/* eslint-disable react/react-in-jsx-scope */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View, TouchableOpacity, Platform } from "react-native";
import SvgTutorial from "../../../assets/menu/tutorial.svg";
import SvgLeft from "../../../assets/menu/left.svg";
import SvgGoodTime from "../../../assets/menu/goodtime.svg";
import LinearGradient from "react-native-linear-gradient";
import fonts from "@fonts";
import GoodLight from "./goodlight";
import GoodDistance from "./gooddistance";
import GoodPosture from "./goodposture";
import GoodTime from "./goodtime";
import { useState } from "react";
import { BOTTOM_DRAWER_HEIGHT, ratioHeight } from "@shared-constants";

interface ITutorialProps {
  setPage: (page: number) => void;
}

const Tutorial: React.FC<ITutorialProps> = ({ setPage }) => {
  const [step, setStep] = useState<number>(0);

  return (
    <View
      style={{
        width: ScreenWidth,
        zIndex: 2000,
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
          height: 55,
          marginLeft: 20,
          marginTop: 5,
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
          <SvgTutorial />
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
          Tutorial{" "}
        </Text>
      </View>
      <View
        style={{
          width: ScreenWidth,
          height: BOTTOM_DRAWER_HEIGHT - 50,
          alignItems: "center",
          backgroundColor: "#00140A",
          marginTop: -40,
          zIndex: -1,
        }}
      >
        {step == 0 && (
          <GoodLight screenHeightRatio={(BOTTOM_DRAWER_HEIGHT - 50) / 667} />
        )}

        {step == 1 && (
          <GoodDistance screenHeightRatio={(BOTTOM_DRAWER_HEIGHT - 50) / 667} />
        )}

        {step == 2 && (
          <GoodPosture screenHeightRatio={(BOTTOM_DRAWER_HEIGHT - 50) / 667} />
        )}

        {step == 3 && <GoodTime />}

        {step == 3 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgGoodTime
              style={{
                marginBottom: 20,
              }}
            />
            <TouchableOpacity
              style={{
                marginBottom: ScreenHeight / 2 - 300,
              }}
              onPress={() => {
                if (step < 3) setStep(step + 1);
                else {
                  setPage(0);
                }
              }}
            >
              <Text
                color="#FFF"
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                }}
              >
                {step == 3 ? "Done" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {step != 3 && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 80 * ratioHeight,
            alignItems: "center",
            justifyContent: "center",
            width: ScreenWidth,
          }}
          onPress={() => {
            if (step < 2) setStep(step + 1);
            else {
              setPage(0);
            }
          }}
        >
          <Text
            color="#FFF"
            style={{
              fontSize: 24,
              fontWeight: "700",
            }}
          >
            {step == 2 ? "Done" : "Next"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Tutorial;
