/* eslint-disable react/react-in-jsx-scope */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { View, TouchableOpacity, Keyboard, Platform } from "react-native";
import SvgAccount from "../../../assets/menu/account.svg";
import SvgLeft from "../../../assets/menu/left.svg";
import LinearGradient from "react-native-linear-gradient";
import CustomButton from "@shared-components/CustomButton";

import useAuth from "../../../redux/guards/useAuth";
import fonts from "@fonts";
import { useState, useEffect } from "react";
import CustomTextInput from "@shared-components/CustomTextInput";
import { BOTTOM_DRAWER_HEIGHT } from "@shared-constants";

interface IAccountProps {
  setPage: (page: number) => void;
  closeBottomDrawer: () => void;
  showToast?: (text: string) => void;
  setShowPrivacy: (status: boolean) => void;
}

const Account: React.FC<IAccountProps> = ({
  setPage,
  closeBottomDrawer,
  showToast,
  setShowPrivacy,
}) => {
  const { user, logout, profileUpdate } = useAuth();
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(user?.fullName);
  const [email, setEmail] = useState<string>(user?.email);

  const onHandleEdit = async () => {
    try {
      if (editingMode == false) {
        setEditingMode(true);
      } else {
        // console.log(name, user?.fullName)
        // console.log(email, user?.email)
        if (userName != user?.fullName || email != user?.email) {
          console.log(userName, email);
          profileUpdate({ fullName: userName, email, id: user?.id });
          showToast("The profile has been updated!");
        }
        setEditingMode(false);
      }
    } catch (e) {
      console.log("e", e);
      showToast(
        "Apologies for the server error. Sorry for the inconvenience caused.",
      );
    }
  };

  const [isKeyboardShown, setKeyboardShown] = useState<boolean>(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardShown(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardShown(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        width: ScreenWidth,
      }}
    >
      <View>
        {!isKeyboardShown && (
          <TouchableOpacity
            style={{
              marginTop: Platform.OS == "android" ? 20 : -30,
              padding: 10,
              marginLeft: 15,
              width: 50,
            }}
            onPress={() => setPage(0)}
          >
            <SvgLeft />
          </TouchableOpacity>
        )}

        <LinearGradient
          locations={[0, 1]}
          colors={["#59d07f", "#4db671"]}
          useAngle={true}
          angle={180}
          style={{
            position: "absolute",
            top: isKeyboardShown
              ? Platform.OS == "android"
                ? 15
                : 0
              : Platform.OS == "android"
              ? 65
              : 10,
            width: "100%",
            left: 0,
            height: isKeyboardShown ? 60 : 110,
            backgroundColor: "transparent",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop:
              Platform.OS == "android" ? 30 : isKeyboardShown ? 15 : 20,
            marginLeft: 20,
            flexGrow: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 15,
              marginRight: 10,
            }}
          >
            <SvgAccount />
          </View>

          <Text
            color="#FFF"
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {" "}
            Account{" "}
          </Text>
        </View>

        <View
          style={{
            marginTop: isKeyboardShown ? 30 : 80,
            marginLeft: 30,
            marginBottom: isKeyboardShown ? 0 : 40,
          }}
        >
          <View
            style={{
              marginTop: 0,
            }}
          >
            <View>
              <Text
                color="rgba(0, 20, 10, 0.50)"
                style={{
                  fontSize: 12,
                  fontStyle: "normal",
                  fontWeight: "300",
                  marginBottom: 10,
                }}
              >
                User Name
              </Text>
              {!editingMode && (
                <Text
                  color="#00140A"
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {user?.fullName}
                </Text>
              )}
              {editingMode && (
                <View
                  style={{
                    width: ScreenWidth - 60,
                  }}
                >
                  <CustomTextInput
                    initialValue={userName}
                    setText={setUserName}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                marginTop: 20,
              }}
            >
              <Text
                color="rgba(0, 20, 10, 0.50)"
                style={{
                  fontSize: 12,
                  fontStyle: "normal",
                  fontWeight: "300",
                  marginBottom: 10,
                }}
              >
                Email Address
              </Text>

              {!editingMode && (
                <Text
                  color="#00140A"
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {user?.email}
                </Text>
              )}

              {editingMode && (
                <View
                  style={{
                    width: ScreenWidth - 60,
                  }}
                >
                  <CustomTextInput initialValue={email} setText={setEmail} />
                </View>
              )}
            </View>

            <CustomButton
              title={editingMode ? "SAVE" : "EDIT"}
              buttonColor={editingMode ? "#00140A" : "rgba(0, 20, 10, 0.50)"}
              buttonStyle={{
                width: 65,
                height: 30,
                borderRadius: 18,
                backgroundColor: "#000",
                marginTop: 27,
              }}
              onPress={() => {
                // toggleModal();
                if (editingMode) {
                  onHandleEdit();
                }
                setEditingMode(!editingMode);
              }}
            />
          </View>
        </View>
      </View>

      <Text
        color="#14251D"
        fontFamily={fonts.azosans.medium}
        style={{
          fontSize: 16,
          fontWeight: "600",
          letterSpacing: 1.6,
          position: "absolute",
          top: BOTTOM_DRAWER_HEIGHT - 140,
          left: 30,
        }}
        onPress={async () => {
          await logout();
          closeBottomDrawer();
        }}
      >
        LOG OUT
      </Text>

      <TouchableOpacity
        style={{
          // padding: 10,
          position: "absolute",
          width: ScreenWidth,
          top: BOTTOM_DRAWER_HEIGHT - 110,
        }}
        onPress={() => setShowPrivacy(true)}
      >
        <Text
          color="rgba(0, 20, 10, 0.30)"
          style={{
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {" "}
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Account;
