import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
/**
 * ? Local Imports
 */
import createStyles from "./GuideScreen.style";
import GoodLight from "@screens/landing/drawer/goodlight";
import CustomButton from "@shared-components/CustomButton";
import GoodDistance from "@screens/landing/drawer/gooddistance";
import GoodPosture from "@screens/landing/drawer/goodposture";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS, ratioHeight, ratioWidth } from "@shared-constants";
import SvgClose from "../../assets/GuideClose.svg";
import SvgGoodTime from "../../assets/menu/goodtime.svg";
import fonts from "@fonts";

interface GuideScreenProps {}

const GuideScreen: React.FC<GuideScreenProps> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [step, setStep] = useState<number>(0);

  return (
    <View style={styles.container}>
      <View>
        {step == 0 && <GoodLight screenHeightRatio={ratioHeight} />}
        {step == 1 && <GoodDistance screenHeightRatio={ratioHeight} />}
        {step == 2 && <GoodPosture screenHeightRatio={ratioHeight} />}
        {/* {step == 3 && <GoodTime />} */}
      </View>

      {step == 3 && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgGoodTime
            style={{
              marginBottom: 40,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 94 * ratioHeight,
            }}
          >
            <CustomButton
              title={step == 0 ? "Skip" : "Back"}
              onPress={() => {
                if (step == 0) NavigationService.navigate(SCREENS.Capture);
                else setStep(step - 1);
              }}
              buttonColor="transparent"
              buttonStyle={{
                width: 112 * ratioWidth,
                height: 46 * ratioWidth,
                borderRadius: 50,
                borderColor: "#FFF",
                borderWidth: 1,
                backgroundColor: "transparent",
                marginRight: 28 * ratioWidth,
              }}
              fontFamily={fonts.azosans.light}
              textStyle={{
                fontSize: 24,
                fontWeight: "300",
              }}
            />

            <CustomButton
              title={step == 3 ? "Start" : "Next"}
              onPress={() => {
                if (step < 3) setStep(step + 1);
                else {
                  NavigationService.navigate(SCREENS.Capture);
                }
              }}
              buttonColor="#FFF"
              titleColor="#00130A"
              fontFamily={fonts.azosans.light}
              buttonStyle={{
                width: 112 * ratioWidth,
                height: 46 * ratioWidth,
                borderRadius: 50,
              }}
              textStyle={{
                fontSize: 24,
                // fontWeight: "300",
              }}
            />
          </View>
        </View>
      )}
      {step != 3 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 94 * ratioHeight,
          }}
        >
          <CustomButton
            title={step == 0 ? "Skip" : "Back"}
            onPress={() => {
              if (step == 0) NavigationService.navigate(SCREENS.Capture);
              else setStep(step - 1);
            }}
            buttonColor="transparent"
            buttonStyle={{
              width: 112 * ratioWidth,
              height: 46 * ratioWidth,
              borderRadius: 50,
              borderColor: "#FFF",
              borderWidth: 1,
              backgroundColor: "transparent",
              marginRight: 28 * ratioWidth,
            }}
            fontFamily={fonts.azosans.light}
            textStyle={{
              fontSize: 24 * ratioWidth,
              fontWeight: "300",
            }}
          />

          <CustomButton
            title={step == 2 ? "Start" : "Next"}
            onPress={() => {
              if (step < 2) setStep(step + 1);
              else {
                NavigationService.navigate(SCREENS.Capture);
              }
            }}
            buttonColor="#FFF"
            titleColor="#00130A"
            fontFamily={fonts.azosans.light}
            buttonStyle={{
              width: 112 * ratioWidth,
              height: 46 * ratioWidth,
              borderRadius: 50,
            }}
            textStyle={{
              fontSize: 24 * ratioWidth,
              // fontWeight: "300",
            }}
          />
        </View>
      )}

      {/* <View
        style={{
          alignItems: "center",
          width: "100%",
          bottom: ScreenHeight / 4 - 120,
          position: "absolute",
        }}
      >
        <CustomButton
          title="EXIT"
          onPress={() => {
            NavigationService.navigate(SCREENS.LANDING);
          }}
          buttonColor="transparent"
          buttonStyle={{
            width: 120,
            height: 45,
            borderRadius: 50,
            borderColor: "#FFF",
            borderWidth: 1,
            backgroundColor: "transparent",
          }}
          textStyle={{
            fontSize: 24,
            fontWeight: "300",
          }}
        />
      </View> */}

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 30 * ratioWidth,
          top: 30 * ratioHeight,
          width: 14 * ratioWidth,
          height: 14 * ratioWidth,
          padding: 10 * ratioWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          NavigationService.goBack();
        }}
      >
        <SvgClose width={14 * ratioWidth} height={14 * ratioWidth} />
      </TouchableOpacity>
    </View>
  );
};

export default GuideScreen;
