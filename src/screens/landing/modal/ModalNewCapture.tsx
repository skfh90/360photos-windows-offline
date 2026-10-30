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
  Pressable
} from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./ModalNewCapture.style";
import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { getData } from "../../../shared/utils";
import { useSelector } from "react-redux";
import { SCREENS } from "@shared-constants";
import * as NavigationService from "react-navigation-helpers";
import fonts from "@fonts";
import { StyleSheet } from "react-native";
import CustomDeleteButton from "@shared-components/CustomDeleteButton";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalNewCaptureProps {
  style?: CustomStyleProp;
  showDropdown: (page: number) => void;
  setShowBlurView: (show: boolean) => void;
  pickFile: (index: number) => void;
}

export interface IModalNewCaptureRef {
  toggle: () => void;
}

const ModalNewCapture = forwardRef<IModalNewCaptureRef, IModalNewCaptureProps>(
  ({ setShowBlurView, showDropdown, pickFile }, ref) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSubModalVisible, setSubModalVisible] = useState(false);
    const [indexOfImport, setIndexOfImport] = useState(0);

    const { isAuthenticated } = useSelector((state: any) => state.authJwt);
    const [hadCredential, setHadCredential] = useState<string>("no");
    const [boldStyle, setBoldStyle] = useState<boolean>(false)

    console.log("0000000000000", boldStyle)
    useEffect(() => {
      getData("hadCredential").then((value) => {
        if (value) setHadCredential(value);
      });
    }, []);

    const toggleModal = () => {
      setShowBlurView(!isModalVisible);
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
        backdropColor="transparent"
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
            },
          ]}
        >
          <TouchableOpacity
          style={[StyleSheet.absoluteFill]}
          onPress={toggleModal}
        />
          <CustomDeleteButton
            buttonStyle={{
              height: 58,
              width: 184,
              justifyContent: "center",
              alignItems: "center",
              marginTop: ScreenHeight / 2 - 150,
              opacity: indexOfImport == 1 ? 0.4 : 1.0,
            }}
            textStyle={{
              marginTop: Platform.OS == "ios" ? 4 : 0,
            }}
            isEnable={indexOfImport == 0}
            onPress={() => {
              if (indexOfImport == 1) {
                setIndexOfImport(0);
                return;
              }
              toggleModal();
              if (isAuthenticated) {
                console.log("go to guide");
                NavigationService.navigate(SCREENS.GUIDE);
              } else if (hadCredential == "yes") showDropdown(1);
              else showDropdown(2);
            }}
            title="CAPTURE NEW"
          />

          <Pressable
            style={{
              height: 60,
              width: 200,
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 10,
              opacity: indexOfImport == 1 ? 0.4 : 1.0,
            }}
            onPress={() => {
              setIndexOfImport((index) => 1 - index);
              setBoldStyle(!boldStyle)

              // if (Platform.OS == "ios") setIndexOfImport(1);
              // else {
              //   pickFile(1);
              //   toggleModal();
              // }
            }}
          >
            <Text
              color="#FFF"
              fontFamily= {!boldStyle ? fonts.azosans.regular : fonts.azosans.bold }
              // fontFamily={fonts.azosans.bold}
              style={{
                // fontStyle: "normal",
                // fontWeight: "350",
                fontSize: 18,
              }}
            >
              Import Existing
            </Text>
          </Pressable>

          {indexOfImport == 1 && (
            <>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 200,
                  paddingBottom: 10,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                activeOpacity={0.4}
                onPress={() => {
                  toggleModal();

                  if (Platform.OS == "ios") {
                    setTimeout(() => {
                      pickFile(1);
                    }, 1000);
                  } else
                    setTimeout(() => {
                      pickFile(1);
                    }, 500);
                  // if (Platform.OS == "ios") setIndexOfImport(1);
                  // else {
                  //   pickFile(1);
                  //   toggleModal();
                  // }
                }}
              >
                <Text
                  color="#FFF"
                  fontFamily={fonts.azosans.regular}
                  style={{
                    // fontStyle: "normal",
                    // fontWeight: "350",
                    fontSize: 18,
                  }}
                >
                  Files
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 200,
                  paddingBottom: 10,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                activeOpacity={0.4}
                onPress={() => {
                  toggleModal();

                  if (Platform.OS == "ios") {
                    setTimeout(() => {
                      pickFile(2);
                    }, 1000);
                  } else
                    setTimeout(() => {
                      pickFile(2);
                    }, 500);
                  // if (Platform.OS == "ios") setIndexOfImport(1);
                  // else {
                  //   pickFile(1);
                  //   toggleModal();
                  // }
                }}
              >
                <Text
                  color="#FFF"
                  fontFamily={fonts.azosans.regular}
                  style={{
                    // fontStyle: "normal",
                    // fontWeight: "350",
                    fontSize: 18,
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

export default ModalNewCapture;
