/* eslint-disable react/display-name */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { View, StyleProp, ViewStyle, StyleSheet, Keyboard } from "react-native";

/**
 * ? Local Imports
 */
// import createStyles from "./ModalRename.style";
import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { TextInput } from "react-native-gesture-handler";
import fonts from "@fonts";
import CustomButton from "@shared-components/CustomButton";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalRenameProps {
  style?: CustomStyleProp;
  changeName: (newPhotoName: string) => void;
  setShowBlurView: (show: boolean) => void;
  oldName: string;
}

export interface IModalRenameRef {
  toggle: () => void;
}

const ModalRename = forwardRef<IModalRenameRef, IModalRenameProps>(
  ({ changeName, oldName, setShowBlurView }, ref) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState<string>("");

    const toggleModal = () => {
      if (isModalVisible) setShowBlurView(false);
      setModalVisible(!isModalVisible);
    };

    useImperativeHandle(ref, () => ({
      toggle: () => {
        toggleModal();
      },
    }));

    useEffect(() => {
      setText(oldName);
    }, [oldName]);

    const [marginBottom, setMarginBottom] = useState<number>(0);

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
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        statusBarTranslucent={true}
        isVisible={isModalVisible}
        deviceHeight={ScreenHeight}
        deviceWidth={ScreenWidth}
        backdropOpacity={0.6}
        animationOut="fadeOut"
        animationIn="fadeIn"
        useNativeDriverForBackdrop={true}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 150,
            width: 300,
            borderRadius: 7,
            backgroundColor: "#FFF",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: marginBottom / 2,
          }}
        >
          <Text
            color="#000"
            style={{
              fontSize: 18,
              fontWeight: "500",
              marginTop: 10,
            }}
          >
            Edit Name
          </Text>

          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            style={styles.textInput}
          ></TextInput>
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <CustomButton
              title="CLOSE"
              buttonColor="#000"
              buttonStyle={{
                width: 85,
                marginRight: 10,
                height: 35,
                borderRadius: 45,
                backgroundColor: "#000",
              }}
              onPress={() => {
                toggleModal();
              }}
            />
            <CustomButton
              title="SAVE"
              buttonColor="#000"
              buttonStyle={{
                width: 85,
                height: 35,
                marginRight: 25,
                borderRadius: 45,
                backgroundColor: "#000",
              }}
              onPress={() => {
                if (text != "" && text != oldName) {
                  changeName(text);
                  toggleModal();
                }
              }}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "rgba(0, 20, 10, 0.1)",
    fontFamily: fonts.azosans.regular,
    fontSize: 14,
    fontWeight: "600",
    color: "#00140a",
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

export default ModalRename;
