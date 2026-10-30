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
// import createStyles from "./SignupItem.style";
// import { ISignupItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import { API_URL, BOTTOM_DRAWER_HEIGHT } from "@shared-constants";
import axios from "axios";
import fonts from "@fonts";
import CustomTextInput from "@shared-components/CustomTextInput";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISignupItemProps {
  style?: CustomStyleProp;
  //   data: ISignupItem;
  showDropdown: (page: number) => void;
  showToast: (text: string) => void;
  closeBottomDrawer: () => void;
  setShowPrivacy: (status: boolean) => void;
  setForgotPasswordEmail: (text: string) => void;
  setCurrentWork: (text: "login" | "signup" | "forgot") => void;
}

const SignupItem: React.FC<ISignupItemProps> = ({
  showDropdown,
  showToast,
  closeBottomDrawer,
  setShowPrivacy,
  setForgotPasswordEmail,
  setCurrentWork,
}) => {
  //   const styles = useMemo(() => createStyles(theme), [theme]);
  //   const { name, description, language, star, fork } = data;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [fullname, setFullname] = useState("");
  const [response, setResponse] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const [emailErrorMsg, setEmailErrorMsg] = useState<string>("");
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);

  const [fullnameErrorMsg, setFullnameErrorMsg] = useState<string>("");
  const [invalidFullname, setInvalidFullname] = useState<boolean>(false);

  const [passwordErrorMsg, setPasswordMsg] = useState<string>("");
  const [inValidPassword, setInvalidPassword] = useState<boolean>(false);

  const [confirmErrorMsg, setConfirmErrorMsg] = useState<string>("");
  const [inValidConfirm, setInvalidConfirm] = useState<boolean>(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

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
  function validateFullname(fullname: string) {
    if (fullname.length == 0) {
      setInvalidFullname(true);
      setFullnameErrorMsg("Please enter your name");
      return false;
    }
    setInvalidFullname(false);
    return true;
  }

  function validatePassword(password: string) {
    if (password.length == 0) {
      setInvalidPassword(true);
      setPasswordMsg("Please enter a password");
      return false;
    }
    if (password.length < 8) {
      setInvalidPassword(true);
      setPasswordMsg("Password must be at least 8 characters");
      return false;
    }
    setInvalidPassword(false);
    return true;
  }

  function validateConfirmPassword(confirmPassword: string) {
    if (confirmPassword.length == 0) {
      setInvalidConfirm(true);
      setConfirmErrorMsg("please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setInvalidConfirm(true);
      setConfirmErrorMsg("Passwords do not match");
      return false;
    }
    setInvalidConfirm(false);
    return true;
  }

  const onHandleSignUp = async () => {
    try {
      // setInvalidEmail(false);
      // setInvalidFullname(false);
      // setInvalidPassword(false);
      // setInvalidConfirm(false);


      validateEmail(email)
      validateFullname(fullname)
      validatePassword(password)
      validateConfirmPassword(confirmPassword)

      if (!validateEmail(email)) return;
      if (!validateFullname(fullname)) return;
      if (!validatePassword(password)) return;
      if (!validateConfirmPassword(confirmPassword)) return;

      setLoading(true);
      if (email !== "" && password !== "") {
        setForgotPasswordEmail(email);
        setCurrentWork("signup");
        const response = await axios.post(
          `${API_URL}/setup/signup/email`,
          {
            email,
            password,
            fullName: fullname,
            nickName: fullname,
            role: 0,
          },
          {
            timeout: 2000,
          },
        );

        // if (response.status == 200) {
        //   showDropdown(5);
        //   showToast("Sent code to your email.");
        // }
        if (response.data.token != "") {
          await register({ response });
          setResponse(response);
        }
      } else {
        showToast("Please enter your email, name, and password.");
      }

      setLoading(false);
    } catch (e: any) {
      console.log("e ->", e);
      if (
        e.response.data.type == "error" &&
        e.response.data.message ===
          "Error: This Email already exist with undefined"
      ) {
        setEmailErrorMsg(
          "This email already exists. Please enter a new email or log in with your current email address.",
        );
        setInvalidEmail(true);
        showToast(
          "This email already exists. Please enter a new email or log in with your current email address.",
        );
      } else {
        showToast(
          "An error has occurred on the server. Kindly reach out to the administrator for further assistance.",
        );
      }
      setLoading(false);
    }
  };

  const [totalHeight, setTotalHeight] = useState<number>(BOTTOM_DRAWER_HEIGHT);
  const [isKeyboardShown, setKeyboardShown] = useState<boolean>(false);
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
        )}

        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 50,
            alignItems: "center",
            flex: 1,
          }}
        >
          {response == null && (
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
                  User Name
                </Text>
                <CustomTextInput
                  onFocus={() => handleInputFocus('fullname')}
                  isFocused={focusedInput === 'fullname'}
                  inValid={invalidFullname}
                  errorMessage={fullnameErrorMsg}
                  setText={setFullname}
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
                  secureTextEntry
                  inValid={inValidPassword}
                  errorMessage={passwordErrorMsg}
                  setText={setPassword}
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
                  Confirm Password
                </Text>

                <CustomTextInput
                  onFocus={() => handleInputFocus('comfirmPassword')}
                  isFocused={focusedInput === 'comfirmPassword'}
                  secureTextEntry
                  inValid={inValidConfirm}
                  errorMessage={confirmErrorMsg}
                  setText={setConfirmPassword}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                {!loading && (
                  <ButSignUp text="SIGN UP" onPress={() => onHandleSignUp()} />
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
                  {" "}
                  Already a user?{" "}
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                  }}
                  onPress={() => {
                    showDropdown(1);
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
                    LOG IN
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
          )}

          {response != null && (
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
                    if (response != null) {
                      closeBottomDrawer();
                    }
                  }}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupItem;
