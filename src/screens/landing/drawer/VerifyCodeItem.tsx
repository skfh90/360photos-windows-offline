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
// import createStyles from "./VerifyCodeItem.style";
// import { IVerifyCodeItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import { API_URL, BOTTOM_DRAWER_HEIGHT } from "@shared-constants";
import axios from "axios";
import fonts from "@fonts";
import CustomTextInput from "@shared-components/CustomTextInput";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IVerifyCodeItemProps {
  style?: CustomStyleProp;
  //   data: IVerifyCodeItem;
  showDropdown: (page: number) => void;
  showToast: (text: string) => void;
  setShowPrivacy: (status: boolean) => void;
  forgotEmail: string;
  currentWork: string;
}

const VerifyCodeItem: React.FC<IVerifyCodeItemProps> = ({
  showDropdown,
  showToast,
  setShowPrivacy,
  forgotEmail,
  currentWork,
}) => {
  const { register } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const [totalHeight, setTotalHeight] = useState<number>(BOTTOM_DRAWER_HEIGHT);
  const [isKeyboardShown, setKeyboardShown] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        // setModalHeight(300 - event.endCoordinates.height);
        // console.log("keyboard height = ", event.endCoordinates.height)
        setTotalHeight(BOTTOM_DRAWER_HEIGHT - event.endCoordinates.height);
        setKeyboardShown(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // setModalHeight(300);
        setTotalHeight(BOTTOM_DRAWER_HEIGHT);
        setKeyboardShown(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getValue = (val: number) => {
    if (isKeyboardShown) return 0;
    return val;
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/setup/reset-password`,
        {
          email: forgotEmail,
        },
        {
          timeout: 2000,
        },
      );
      console.log("-----------response---------------");
      console.log(response.data);
      if (response.status == 200) {
        showToast("Sent code to your email again.");
      } else {
        showToast(`This email ${forgotEmail} was not found`);
      }
    } catch (error) {}

    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      console.log(forgotEmail, otpCode);
      const response = await axios.post(
        `${API_URL}/setup/verifyOtpCode`,
        {
          email: forgotEmail,
          otpCode: otpCode,
        },
        {
          timeout: 2000,
        },
      );

      if (response.status == 200) {
        showToast("Successfully verified.");
        if (currentWork == "forgot") showDropdown(6);
        else if (currentWork == "signup" || "login") {
          await register({ response: response });
          showDropdown(7);
        }
      } else {
        showToast("Please check otp Code");
      }
    } catch (error) {
      console.log("error = ", error);
    }
    setLoading(false);
  };

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
        {!isKeyboardShown && (
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
        )}

        {!isKeyboardShown && (
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
              VERIFY
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
              Please input the code we just sent you.
            </Text>
          </View>
        )}

        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 10,
            alignItems: "center",
            flex: 1,
          }}
        >
          <ScrollView
            style={{
              // backgroundColor: "blue",
              width: "100%",
              // height: ScreenHeight - 350,
              flex: 1,
              zIndex: 20,
            }}
            keyboardShouldPersistTaps="always"
          >
            <View
              style={{
                marginTop: getValue(50),
              }}
            >
              <Text
                color="rgba(0, 20 ,10, 0.5)"
                fontFamily={fonts.azosans.regular}
                style={{
                  fontSize: 12,
                  marginBottom: getValue(8),
                }}
              >
                Enter Verification Code
              </Text>
              <CustomTextInput setText={setOtpCode} />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Text
                color="black"
                style={{
                  fontSize: 14,
                }}
              >
                {" "}
                if you didn't receive a code{" "}
              </Text>
              <TouchableOpacity
                style={{
                  padding: 5,
                }}
                onPress={() => {
                  handleResend();
                }}
              >
                <Text
                  color="#59D07F"
                  fontFamily={fonts.azosans.bold}
                  style={{
                    fontSize: 14,
                    fontWeight: "900",
                    fontStyle: "normal",
                    textDecorationLine: "underline",
                  }}
                >
                  Resend
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: "center",
                marginTop: 38,
              }}
            >
              {!loading && (
                <ButSignUp
                  text="ENTER"
                  onPress={() => {
                    handleVerify();
                  }}
                />
              )}
              {loading && (
                <Image
                  style={{
                    width: 45,
                    height: 45,
                  }}
                  source={require("../../../assets/landing/360-Loader-400px.gif")}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text
                color="rgba(0, 20, 10, 0.50)"
                style={{
                  fontSize: 14,
                }}
              >
                Not yet a user?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  showDropdown(2);
                }}
                style={{
                  padding: 5,
                }}
              >
                <Text
                  color="rgba(0, 20, 10, 0.70)"
                  fontFamily={fonts.azosans.bold}
                  style={{
                    fontSize: 14,
                    fontWeight: "900",
                    fontStyle: "normal",
                    textDecorationLine: "underline",
                  }}
                >
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                }}
                onPress={() => setShowPrivacy(true)}
              >
                <Text
                  color="rgba(0, 20, 10, 0.30)"
                  style={{
                    fontSize: 12,
                  }}
                >
                  {" "}
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default VerifyCodeItem;
