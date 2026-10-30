import React, { useState, useEffect } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import useAuth from "../../../redux/guards/useAuth";
/**
 * ? Local Imports
 */
// import createStyles from "./ThanksItem.style";
// import { IThanksItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import { API_URL, BOTTOM_DRAWER_HEIGHT } from "@shared-constants";
import axios from "axios";
import fonts from "@fonts";
import CustomTextInput from "@shared-components/CustomTextInput";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IThanksItemProps {
  style?: CustomStyleProp;
  closeBottomDrawer: () => void;
}

const ThanksItem: React.FC<IThanksItemProps> = ({ closeBottomDrawer }) => {
  const [totalHeight] = useState<number>(BOTTOM_DRAWER_HEIGHT);

  return (
    <ScrollView
      style={{
        flex: 1,
        width: ScreenWidth,
        marginTop: Platform.OS == "android" ? -70 : 0,
      }}
      keyboardShouldPersistTaps="always"
    >
      <View
        style={{
          flex: 1,
          height: totalHeight,
        }}
      >
        <LinearGradient
          style={{
            height: 107,
            backgroundColor: "transparent",
            top: Platform.OS == "android" ? 20 : 0,
            width: ScreenWidth,
            position: "absolute",
          }}
          locations={[0, 1]}
          colors={["#59d07f", "#4db671"]}
          useAngle={true}
          angle={180}
        />

        <View
          style={{
            paddingVertical: 35,
            paddingHorizontal: 25,
            height: 120,
            marginTop: Platform.OS == "android" ? 10 : -5,
          }}
        >
          <Text
            color="#FFF"
            fontFamily={fonts.azosans.medium}
            style={{
              fontSize: 24,
              lineHeight: 35,
            }}
          >
            SIGN UP
          </Text>

          <Text
            color="#FFF"
            fontFamily={fonts.azosans.regular}
            style={{
              fontFamily: "Azo Sans",
              fontSize: 16,
              lineHeight: 20,
            }}
          >
            to create and share your 360 photos.
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 10,
            alignItems: "center",
            flex: 1,
          }}
        >
          <ScrollView style={{ width: "100%" }}>
            <View
              style={{
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <Text
                color="#000"
                style={{
                  fontSize: 24,
                }}
              >
                {" "}
                Thank You!{" "}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 80,
              }}
            >
              <ButSignUp
                text="CONTINUE"
                onPress={async () => {
                  closeBottomDrawer();
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default ThanksItem;
