/* eslint-disable react/display-name */
import { ScreenHeight } from "@freakycoder/react-native-helpers";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from "react-native";

import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { getData } from "../../../shared/utils";
import { useSelector } from "react-redux";
import { SCREENS } from "@shared-constants";
import * as NavigationService from "react-navigation-helpers";
import fonts from "@fonts";
import { StyleSheet } from "react-native";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalDropDownProps {
  style?: CustomStyleProp;
  showDropdown: (page: number) => void;
  pickFile: (index: number) => void;
}

export interface IModalDropDownRef {
  toggle: () => void;
}

const ModalDropDown = forwardRef<IModalDropDownRef, IModalDropDownProps>(
  ({ showDropdown, pickFile }, ref) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSubModalVisible, setSubModalVisible] = useState(false);
    const [indexOfImport, setIndexOfImport] = useState(0);

    const { isAuthenticated } = useSelector((state: any) => state.authJwt);
    const [hadCredential, setHadCredential] = useState<string>("no");

    useEffect(() => {
      getData("hadCredential").then((value) => {
        if (value) setHadCredential(value);
      });
    }, []);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    useImperativeHandle(ref, () => ({
      toggle: () => {
        toggleModal();
        setIndexOfImport(0);
      },
    }));

    return (
      <Modal
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        animationOut="fadeOut"
        animationIn="fadeIn"
        statusBarTranslucent={true}
        isVisible={isModalVisible}
        deviceHeight={ScreenHeight}
        useNativeDriverForBackdrop={true}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={{
              height: 58,
              width: 184,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
            onPress={() => {
              toggleModal();
              if (isAuthenticated) {
                console.log("go to guide");
                NavigationService.navigate(SCREENS.GUIDE);
              } else if (hadCredential == "yes") showDropdown(1);
              else showDropdown(2);
            }}
          >
            <Text
              color="#000"
              fontFamily={fonts.azosans.bold}
              style={{
                fontSize: 18,
                fontWeight:700,
              }}
            >
              CAPTURE NEW
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: 10,
              height: 40,
              width: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setIndexOfImport(1);
              // if (Platform.OS == "ios") setIndexOfImport(1);
              // else {
              //   pickFile(1);
              //   toggleModal();
              // }
            }}
          >
            <Text
              color="#FFF"
              fontFamily={fonts.azosans.light}
              style={{
                // fontStyle: "normal",
                // fontWeight: "350",
                fontSize: 22,
              }}
            >
              Import Existing
            </Text>
          </TouchableOpacity>

          {indexOfImport == 1 && (
            <>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setIndexOfImport(1);
                  // if (Platform.OS == "ios") setIndexOfImport(1);
                  // else {
                  //   pickFile(1);
                  //   toggleModal();
                  // }
                }}
              >
                <Text
                  color="#FFF"
                  fontFamily={fonts.azosans.light}
                  style={{
                    // fontStyle: "normal",
                    // fontWeight: "350",
                    fontSize: 22,
                  }}
                >
                  Files
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setIndexOfImport(1);
                  // if (Platform.OS == "ios") setIndexOfImport(1);
                  // else {
                  //   pickFile(1);
                  //   toggleModal();
                  // }
                }}
              >
                <Text
                  color="#FFF"
                  fontFamily={fonts.azosans.light}
                  style={{
                    // fontStyle: "normal",
                    // fontWeight: "350",
                    fontSize: 22,
                  }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
            </>
            // <View
            //   style={{
            //     flexDirection: "row",
            //     height: 75,
            //     width: 200,
            //     alignItems: "center",
            //   }}
            // >
            //   <TouchableOpacity
            //     style={{
            //       flex: 1,
            //       height: 75,
            //       alignItems: "center",
            //       justifyContent: "center",
            //     }}
            //     onPress={() => {
            //       toggleModal();
            //       setTimeout(() => {
            //         pickFile(1);
            //       }, 1000);
            //     }}
            //   >
            //     <Text
            //       color="#000"
            //       fontFamily={fonts.azosans.light}
            //       style={{
            //         // fontStyle: "normal",
            //         // fontWeight: "350",
            //         fontSize: 22,
            //       }}
            //     >
            //       Files
            //     </Text>
            //   </TouchableOpacity>
            //   <TouchableOpacity
            //     style={{
            //       flex: 1,
            //       height: 75,
            //       alignItems: "center",
            //       justifyContent: "center",
            //     }}
            //     onPress={() => {
            //       toggleModal();
            //       setTimeout(() => {
            //         pickFile(2);
            //       }, 1000);
            //     }}
            //   >
            //     <Text
            //       color="#000"
            //       fontFamily={fonts.azosans.light}
            //       style={{
            //         // fontStyle: "normal",
            //         // fontWeight: "350",
            //         fontSize: 22,
            //       }}
            //     >
            //       Photos
            //     </Text>
            //   </TouchableOpacity>
            // </View>
          )}
        </View>
      </Modal>
    );
  },
);

export default ModalDropDown;
