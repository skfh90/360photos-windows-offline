import React, { useState, useEffect } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  Image,
} from "react-native";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import { API_URL, BOTTOM_DRAWER_HEIGHT } from "@shared-constants";
import axios from "axios";
import fonts from "@fonts";
import CustomTextInput from "@shared-components/CustomTextInput";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISForgotPasswordItemProps {
  style?: CustomStyleProp;
  showDropdown: (page: number) => void;
  showToast: (text: string) => void;
  setForgotPasswordEmail: (text: string) => void;
  setCurrentWork: (text: "login" | "signup" | "forgot") => void;
  setShowPrivacy: (status: boolean) => void;
}

const ForgotPasswordItem: React.FC<ISForgotPasswordItemProps> = ({
  showDropdown,
  showToast,
  setShowPrivacy,
  setForgotPasswordEmail,
  setCurrentWork,
}) => {
  const [email, setEmail] = useState<string>("");
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [totalHeight, setTotalHeight] = useState<number>(BOTTOM_DRAWER_HEIGHT);
  const [isKeyboardShown, setKeyboardShown] = useState<boolean>(false);

  useEffect(() => {
    if (response) {
      setResetSuccess(true);
    }
  }, [response]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setTotalHeight(BOTTOM_DRAWER_HEIGHT - event.endCoordinates.height);
        setKeyboardShown(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
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

  const onHandleForgotPassword = async () => {
    try {
      if (email !== "") {
        setLoading(true);
        setCurrentWork("forgot");

        const response = await axios.post(
          `${API_URL}/setup/reset-password`,
          {
            email,
          },
          {
            timeout: 2000,
          },
        );
        if (response.status == 200) {
          showDropdown(5);
          showToast("Sent code to your email.");
        } else {
          showToast(`This email ${email} was not found`);
        }
        setLoading(false);
      } else {
        showToast("Please enter your email.");
        setLoading(false);
      }
    } catch (e: any) {
      console.log("e ->", e);
      setLoading(false);
    }
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
              height: 140,
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
              paddingVertical: 25,
              paddingHorizontal: 25,
              height: 140,
              marginTop: Platform.OS == "android" ? 45 : 30,
            }}
          >
            <Text
              color="#00140A"
              fontFamily={fonts.azosans.medium}
              style={{
                fontSize: 24,
              }}
            >
              Forgot Password?
            </Text>
            <Text
              color="#FFF"
              fontFamily={fonts.azosans.medium}
              style={{
                fontFamily: "Azo Sans",
                fontSize: 24,
              }}
            >
              No Problem!
            </Text>
          </View>
        )}
        <View
          style={{
            paddingHorizontal: 25,
            alignItems: "center",
            flex: 1,
          }}
        >
          <ScrollView
            style={{
              width: "100%",
              flex: 1,
              zIndex: 20,
            }}
            keyboardShouldPersistTaps="always"
          >
            {resetSuccess == false ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  <Text
                    color="rgba(0, 20, 10, 0.50)"
                    style={{
                      fontSize: 14,
                    }}
                  >
                    We'll send you a code to reset.
                  </Text>
                </View>
                <View>
                  <Text
                    color="rgba(0, 20 ,10, 0.5)"
                    fontFamily={fonts.azosans.regular}
                    style={{
                      fontSize: 12,
                      marginTop: 32,
                      marginBottom: getValue(8),
                    }}
                  >
                    Account Email
                  </Text>
                  <CustomTextInput
                    setText={(text) => {
                      setEmail(text);
                      setForgotPasswordEmail(text);
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 49,
                }}
              >
                <Text
                  color="black"
                  fontFamily={fonts.azosans.medium}
                  style={{
                    fontSize: 24,
                    lineHeight: 35,
                    fontWeight: 700,
                  }}
                >
                  Thank You!
                </Text>
                <Text
                  color="rgba(0, 20, 10, 0.50)"
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  Please Check your email to confirm your password reset.
                </Text>
              </View>
            )}

            <View
              style={{
                alignItems: "center",
                marginTop: 38,
              }}
            >
              {!loading && !resetSuccess && (
                <ButSignUp
                  text="RESET PASSWORD"
                  onPress={() => onHandleForgotPassword()}
                />
              )}
              {!loading && resetSuccess && (
                <ButSignUp
                  text="HOME"
                  onPress={() => {
                    showDropdown(1);
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
                marginTop: 0,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                }}
                onPress={() => {
                  if (Platform.OS == "android") setShowPrivacy(true);
                  if (Platform.OS == "ios") {
                    setTimeout(() => {
                      console.log("show policy is true");
                      setShowPrivacy(true);
                    }, 400);
                  }
                }}
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

export default ForgotPasswordItem;
