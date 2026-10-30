/* eslint-disable no-empty */
import React, { useEffect, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Image,
  Platform,
  TextInput,
} from "react-native";

/**
 * ? Local Imports
 */
// import createStyles from "./SigninItem.style";
// import { ISigninItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import useAuth from "../../../redux/guards/useAuth";
import fonts from "@fonts";
import CustomTextInput from "@shared-components/CustomTextInput";
import axios from "axios";
import { API_URL } from "@shared-constants";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISigninItemProps {
  style?: CustomStyleProp;
  //   data: ISigninItem;
  showDropdown: (page: number) => void;
  showToast: (text: string) => void;
  closeBottomDrawer: () => void;
  setShowPrivacy: (status: boolean) => void;
  handleLoginSuccess: () => void;
  setForgotPasswordEmail: (text: string) => void;
  setCurrentWork: (text: "login" | "signup" | "forgot") => void;
}

const SigninItem: React.FC<ISigninItemProps> = ({
  showDropdown,
  showToast,
  closeBottomDrawer,
  setShowPrivacy,
  handleLoginSuccess,
  setForgotPasswordEmail,
  setCurrentWork,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string>("");
  const [passwordErrorMsg, setPasswordMsg] = useState<string>("");

  const { login, isAuthenticated, postLogin } = useAuth();

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };


  useEffect(() => {
    if (isAuthenticated) {
      handleLoginSuccess();
      closeBottomDrawer();
    }
  }, [isAuthenticated]);

  function validateEmail(email: string) {
    if (email.length == 0) {
      setInvalidEmail(true);
      setEmailErrorMsg("Please enter your email");
      return false;
    }
    if (email.includes("@") == false) {
      setInvalidEmail(true);
      setEmailErrorMsg("Invalid Email");
      return false;
    }
    setInvalidEmail(false);
    return true;
  }

  function validatePassword(password: string) {
    if (password.length == 0) {
      setInvalidPassword(true);
      setPasswordMsg("Please enter your password");
      return false;
    }
    setInvalidPassword(false);
    return true;
  }

  const onHandleLogin = async () => {
      validateEmail(email)
      validatePassword(password)
      setWrongPassword(false)

      if (!validateEmail(email)) return;
      if (!validatePassword(password)) return;
      // showToast("Please enter your email and password.");

    try {
      setLoading(true);
      setForgotPasswordEmail(email);
      const rawResponse = await fetch(`${API_URL}/setup/signin/email`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const response = await rawResponse.json();

      console.log(response.type);
      if (response.type != "success") {
        throw response;
      }

      if (response.isVerified == false) {
        console.log("verify your account");
        showToast("Verify your account");
        showDropdown(5);
      } else {
        const accessToken = response.token;
        const user = {
          fullName: response.user.fullName,
          email: response.user.email,
          role: response.user.role,
          credit: response.user.credit,
        };
        await postLogin({
          accessToken,
          user,
        });
      }
      setLoading(false);
    } catch (e: any) {
      console.log("e ->", e);
      try {
        if (e.type == "error" && e.message === "Error: Incorrect password") {
          setWrongPassword(true);
          setInvalidEmail(false);
        } else if (
          e.type == "error" &&
          e.message === "Error: Incorrect account"
        ) {
          setEmailErrorMsg("This accout does not exist!")
          setInvalidEmail(true);
          setInvalidPassword(false);
        } else {
          showToast(
            "An error has occurred on the server. Kindly reach out to the administrator for further assistance.",
          );
        }
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    }
  };

  const [isKeyboardShown, setKeyboardShown] = useState<boolean>(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        // setModalHeight(300 - event.endCoordinates.height);
        // console.log("keyboard height = ", event.endCoordinates.height)
        setKeyboardShown(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // setModalHeight(300);
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

  return (
    <View
      style={{
        width: ScreenWidth,
        flex: 1,
        marginTop: Platform.OS == "android" ? -70 : 0,
      }}
    >
      <View
        style={{
          flex: 1,
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
              marginTop: Platform.OS == "android" ? 10 : 0,
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
              LOG IN
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
        )}

        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <ScrollView
            style={{ width: "100%", height: ScreenHeight - 320, marginTop:30 }}
            keyboardShouldPersistTaps="always"
          >
            <View>
              <Text
                color="rgba(0, 20 ,10, 0.5)"
                fontFamily={fonts.azosans.regular}
                style={{
                  fontSize: 12,
                  marginBottom: getValue(8),
                }}
              >
                Email
              </Text>
              <CustomTextInput
                onFocus={() => handleInputFocus('email')}
                isFocused={focusedInput === 'email'}
                inValid={invalidEmail}
                errorMessage={emailErrorMsg}
                setText={setEmail}
                forgotPassword={false}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Text
                color="rgba(0, 20 ,10, 0.5)"
                fontFamily={fonts.azosans.regular}
                style={{
                  fontSize: 12,
                  marginBottom: getValue(8),
                }}
              >
                Password
              </Text>

              <CustomTextInput
                onFocus={() => handleInputFocus('password')}
                isFocused={focusedInput === 'password'}
                setText={setPassword}
                inValid={invalidPassword}
                errorMessage={passwordErrorMsg}
                secureTextEntry
              />
            </View>

            <View
              style={{
                marginTop: 10,
                alignItems: "center",
              }}
            >
              {wrongPassword && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    color="#FF6161"
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {" "}
                    Invalid Password.{" "}
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 5,
                    }}
                    onPress={() => {
                      showDropdown(4);
                    }}
                  >
                    <Text
                      color="#FF6161"
                      fontFamily={fonts.azosans.bold}
                      style={{
                        fontSize: 14,
                        textDecorationLine: "underline",
                      }}
                    >
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {!loading && (
                <ButSignUp text="LOG IN" onPress={() => onHandleLogin()} />
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
                  // forgotPassword(email);
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
    </View>
  );
};

export default SigninItem;
