import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";

import TextWrapper from "./text-wrapper/TextWrapper";
import fonts from "@fonts";

interface ICustomDeleteButtonProps {
  title: string;
  onPress: () => void;
  buttonColor?: string;
  titleColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  fontFamily?: string;
  isEnable?: boolean;
}

const CustomDeleteButton: React.FC<ICustomDeleteButtonProps> = ({
  title,
  onPress,
  buttonColor,
  titleColor,
  buttonStyle,
  textStyle,
  fontFamily,
  isEnable = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable
      style={{
        ...styles.container,
        ...buttonStyle,
        backgroundColor: isPressed ? "#59D07F" : "#FFF",
      }}
      onPress={onPress}
      onPressIn={() => {
        if (isEnable) setIsPressed(true);
      }}
      onPressOut={() => {
        if (isEnable) setIsPressed(false);
      }}
    >
      <TextWrapper
        fontFamily={fontFamily ? fontFamily : fonts.azosans.bold}
        color={titleColor || isPressed ? "#FFF" : "#000"}
        style={{ ...styles.title, ...textStyle, color: titleColor || "#fff" }}
      >
        {title}
      </TextWrapper>
    </Pressable>
  );
};

export default CustomDeleteButton;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 50,
    width: 184,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 18,
  },
});
