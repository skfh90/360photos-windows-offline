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
// import createStyles from "./NewPasswordItem.style";
// import { INewPasswordItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import { API_URL, BOTTOM_DRAWER_HEIGHT } from "@shared-constants";
import axios from "axios";
import fonts from "@fonts";
import CustomTextInput from "@shared-components/CustomTextInput";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface INewPasswordItemProps {
  style?: CustomStyleProp;
  //   data: INewPasswordItem;
  showDropdown?: (page: number) => void;
  showToast?: (text: string) => void;
  setShowPrivacy: (status: boolean) => void;
  forgotEmail: string;
  closeBottomDrawer: () => void;
}

const NewPasswordItem: React.FC<INewPasswordItemProps> = ({
  showDropdown,
  showToast,
  setShowPrivacy,
  forgotEmail,
  closeBottomDrawer,
}) => {
  const { register } = useAuth();

  const [totalHeight, setTotalHeight] = useState<number>(BOTTOM_DRAWER_HEIGHT);
  const [isKeyboardShown, setKeyboardShown] = useState<boolean>(false);

  const [warning, setWarning] = useState(false);
  const [notMatchWarning, setNotMatchWarning] = useState(false);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    if (confirmPassword != password) {
      setNotMatchWarning(true);
    } else {
      setNotMatchWarning(false);
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    setWarning(validatePassword(password));
  }, [password]);

  function validatePassword(password: string) {
    if (password.length == 0) {
      return true;
    }

    // Check if the password length is at least 8 characters
    if (password.length < 8) {
      return false;
    }

    // Check if the password contains at least 1 number
    if (!/\d/.test(password)) {
      return false;
    }

    // Check if the password contains at least 1 special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      // return false;
    }

    // If all conditions are met, return true
    return true;
  }

  const [loading, setLoading] = useState(false);

  const onHandleNewPassword = async () => {
    try {
      if (validatePassword(password) == false) {
        return;
      }
      setLoading(true);

      console.log("----------response------------");
      console.log("email =========", forgotEmail);
      const response = await axios.post(
        `${API_URL}/setup/new-password`,
        {
          email: forgotEmail,
          password,
        },
        {
          timeout: 2000,
        },
      );

      console.log(response.data);

      if (response.status == 200) {
        register({ response });
        closeBottomDrawer();
      }
      setLoading(false);
    } catch (e: any) {
      console.log("-----------errror -------------", e);
      setLoading(false);
    }
  };

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
              CHANGE PASSWORD
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
              Set new password to protect your account
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
                marginTop: getValue(10),
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
                Enter New Password
              </Text>
              <CustomTextInput
                setText={setPassword}
                secureTextEntry
                // inValid={warning}
              />
              {!warning && (
                <Text
                  color="#FF6161"
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  Must be 8 or more characters and contain at least 1 number
                </Text>
              )}

              <Text
                color="rgba(0, 20 ,10, 0.5)"
                fontFamily={fonts.azosans.regular}
                style={{
                  fontSize: 12,
                  marginBottom: getValue(8),
                  marginTop: 10,
                }}
              >
                Confirm
              </Text>
              <CustomTextInput
                setText={setConfirmPassword}
                secureTextEntry
                inValid={notMatchWarning}
              />
              {notMatchWarning && (
                <Text
                  color="#FF6161"
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  Passwords do not match.
                </Text>
              )}
            </View>

            <View
              style={{
                alignItems: "center",
                marginTop: 38,
              }}
            >
              {!loading && (
                <ButSignUp
                  text="RESET"
                  onPress={() => {
                    onHandleNewPassword();
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

export default NewPasswordItem;
