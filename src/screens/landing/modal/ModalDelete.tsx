/* eslint-disable react/display-name */
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./ModalDelete.style";
import Modal from "react-native-modal";
import Text from "@shared-components/text-wrapper/TextWrapper";
import CustomButton from "@shared-components/CustomButton";
import fonts from "@fonts";
import CustomDeleteButton from "@shared-components/CustomDeleteButton";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IModalDeleteProps {
  style?: CustomStyleProp;
  deletePhotoItem: () => void;
  setShowBlurView: (show: boolean) => void;
}

export interface IModalDeleteRef {
  toggle: () => void;
}

const ModalDelete = forwardRef<IModalDeleteRef, IModalDeleteProps>(
  ({ deletePhotoItem, setShowBlurView }, ref) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      if (isModalVisible) setShowBlurView(false);
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
        backdropColor="transparent"
        animationOut="fadeOut"
        animationIn="fadeIn"
        useNativeDriverForBackdrop={true}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
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
          <View
            style={{
              height: 58,
              width: 184,
              justifyContent: "center",
              alignItems: "center",
              marginTop: ScreenHeight / 2 - 200,
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
              Delete this item?
            </Text>
          </View>

          <CustomDeleteButton
            buttonStyle={{
              height: 50,
              width: 184,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              marginTop: 25,
            }}
            onPress={() => {
              toggleModal();
              deletePhotoItem();
            }}
            title="DELETE"
          />

          <TouchableOpacity
            activeOpacity={0.4}
            style={{
              height: 50,
              width: 200,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={() => {
              toggleModal();
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
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            height: 120,
            width: 300,
            borderRadius: 7,
            backgroundColor: "#FFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            color="#000"
            style={{
              fontSize: 18,
              fontWeight: "500",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Are you sure to delete this item?
          </Text>
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <CustomButton
              title="OK"
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
                deletePhotoItem();
              }}
            />
            <CustomButton
              title="CANCEL"
              buttonColor="#000"
              buttonStyle={{
                width: 85,
                height: 35,
                marginRight: 25,
                borderRadius: 45,
                backgroundColor: "#000",
              }}
              onPress={() => {
                toggleModal();
              }}
            />
          </View>
        </View> */}
      </Modal>
    );
  },
);

export default ModalDelete;
