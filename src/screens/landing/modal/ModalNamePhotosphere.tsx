/* eslint-disable react/display-name */
import { ScreenWidth, ScreenHeight } from "@freakycoder/react-native-helpers";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Keyboard,
  Pressable,
} from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./ModalNamePhotosphere.style";
import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { TextInput } from "react-native-gesture-handler";
import fonts from "@fonts";
import CustomButton from "@shared-components/CustomButton";
import Toast from "react-native-root-toast";
import CustomDeleteButton from "@shared-components/CustomDeleteButton";

import { RootSiblingParent } from "react-native-root-siblings";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalNamePhotosphereProps {
  style?: CustomStyleProp;
  handleRename(text: string): void;
  setShowBlurView: (show: boolean) => void;
}

export interface IModalNamePhotosphereRef {
  toggle: () => void;
}

const ModalNamePhotosphere = forwardRef<
  IModalNamePhotosphereRef,
  IModalNamePhotosphereProps
>(({ style, handleRename, setShowBlurView }, ref) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState<string>("");

  const [marginBottom, setMarginBottom] = useState<number>(0);

  const toggleModal = () => {
    if (isModalVisible) setShowBlurView(false);
    setModalVisible(!isModalVisible);
  };

  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = () => {
    setToastVisible(true);

    if (timerRef.current != null) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
    // toastRef.current.show(text);
    // ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  useImperativeHandle(ref, () => ({
    toggle: () => {
      toggleModal();
    },
  }));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        // setModalHeight(300 - event.endCoordinates.height);
        // console.log("keyboard height = ", event.endCoordinates.height)
        setMarginBottom(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // setModalHeight(300);
        setMarginBottom(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={isModalVisible}
      deviceHeight={ScreenHeight}
      deviceWidth={ScreenWidth}
      backdropColor="transparent"
      animationOut="fadeOut"
      animationIn="fadeIn"
      useNativeDriverForBackdrop={true}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RootSiblingParent>
        <View
          style={{
            marginBottom: marginBottom / 2,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            color="#FFF"
            fontFamily={fonts.azosans.regular}
            style={{
              fontSize: 18,
              fontWeight: "400",
            }}
          >
            Name Your 360 Photo
          </Text>
          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            style={styles.textInput}
          />
          <CustomDeleteButton
            buttonStyle={{
              height: 50,
              width: 184,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              marginTop: 40,
            }}
            onPress={() => {
              if (text == "") showToast();
              else {
                toggleModal();
                handleRename(text);
              }
            }}
            title="SAVE"
          />

          <Pressable
            style={{
              height: 50,
              width: 184,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => {
              toggleModal();
            }}
          >
            <Text
              color="#FFF"
              fontFamily={fonts.azosans.regular}
              style={{
                fontSize: 18,
                fontWeight: "400",
                marginTop: 20,
              }}
            >
              Skip
            </Text>
          </Pressable>
        </View>
        <Toast
          visible={toastVisible}
          position={Toast.positions.TOP}
          shadow={true}
          animation={true}
          hideOnPress={true}
          containerStyle={{
            width: ScreenWidth - 50,
          }}
          textStyle={{
            fontFamily: fonts.azosans.regular,
          }}
          delay={0}
        >
          Please enter a name for your 360 photo
        </Toast>
      </RootSiblingParent>
    </Modal>
  );
});

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "#FFF",
    borderBottomWidth: 1,
    fontFamily: fonts.azosans.regular,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    borderRadius: 8,
    paddingBottom: 10,
    paddingEnd: 36,
    paddingTop: 10,
    paddingStart: 10,
    height: 50,
    width: 250,
    marginTop: 10,
  },
});

export default ModalNamePhotosphere;
