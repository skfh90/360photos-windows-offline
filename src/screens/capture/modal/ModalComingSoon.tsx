/* eslint-disable react/display-name */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./ModalComingSoon.style";
import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import fonts from "@fonts";
import CustomHighlightButton from "@shared-components/CustomHighlightButton";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalComingSoonProps {
  style?: CustomStyleProp;
  doExit?: () => void;
}

export interface IModalComingSoonRef {
  toggle: () => void;
}

const ModalComingSoon = forwardRef<IModalComingSoonRef, IModalComingSoonProps>(
  ({ doExit }, ref) => {
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
            SHOOT.
          </Text>

          <View>
            <Text
              color="#FFF"
              style={{
                fontSize: 22,
                fontWeight: "500",
                marginTop: 80,
                textAlign: "center",
              }}
            >
              Your device doesn't support ultra-wide angle camera.
            </Text>

            <Text
              color="#FFF"
              style={{
                fontSize: 22,
                fontWeight: "500",
                marginTop: 40,
                textAlign: "center",
              }}
            >
              A new app update for your device is coming soon.
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 80,
            }}
          >
            <CustomHighlightButton
              title="Try later"
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
  },
);

export default ModalComingSoon;
