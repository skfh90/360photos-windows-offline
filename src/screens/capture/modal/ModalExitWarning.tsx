/* eslint-disable react/display-name */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./ModalExitWarning.style";
import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import fonts from "@fonts";
import CustomButton from "@shared-components/CustomButton";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalExitWarningProps {
  style?: CustomStyleProp;
  doContinue?: () => void;
  doExit?: () => void;
}

export interface IModalExitWarningRef {
  toggle: () => void;
}

const ModalExitWarning = forwardRef<
  IModalExitWarningRef,
  IModalExitWarningProps
>(({ style, doContinue, doExit }, ref) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useImperativeHandle(ref, () => ({
    toggle: () => {
      toggleModal();
    },
  }));

  return (
    <Modal
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      statusBarTranslucent={true}
      isVisible={isModalVisible}
      deviceHeight={ScreenHeight}
      deviceWidth={ScreenWidth}
      animationOut="fadeOut"
      animationIn="fadeIn"
      useNativeDriverForBackdrop={true}
      style={{
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: ScreenHeight - 100,
          width: ScreenWidth - 100,
          borderRadius: 7,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -80,
        }}
      >
        <Text
          color="#FFF"
          fontFamily={fonts.azosans.bold}
          style={{
            fontSize: 22,
            fontWeight: "500",
            marginTop: 10,
          }}
        >
          ARE YOU SURE?
        </Text>

        <Text
          color="#FFF"
          style={{
            fontSize: 22,
            fontWeight: "500",
            marginTop: 80,
            textAlign: "center",
          }}
        >
          Exiting now will cancel your capture
        </Text>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: 80,
          }}
        >
          <CustomButton
            title="Capture"
            buttonColor="#FFF"
            titleColor="#00140A"
            buttonStyle={{
              width: 150,
              height: 50,
              borderRadius: 45,
            }}
            textStyle={{
              fontSize: 24,
            }}
            onPress={() => {
              toggleModal();
              doContinue();
            }}
          />
          <CustomButton
            title="Exit"
            buttonColor="transparent"
            titleColor="#FFF"
            textStyle={{
              fontSize: 24,
            }}
            buttonStyle={{
              width: 150,
              height: 50,
              borderRadius: 45,
              borderWidth: 1,
              borderColor: "#FFF",
              marginTop: 50,
            }}
            onPress={() => {
              toggleModal();
              doExit();
            }}
          />
        </View>
      </View>
    </Modal>
  );
});

export default ModalExitWarning;
