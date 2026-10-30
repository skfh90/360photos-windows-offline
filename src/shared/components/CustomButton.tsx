import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

import TextWrapper from "./text-wrapper/TextWrapper";
import fonts from "@fonts";

interface ICustomButtonProps {
  title: string;
  onPress: () => void;
  buttonColor?: string;
  titleColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  fontFamily?: string;
}

const CustomButton: React.FC<ICustomButtonProps> = ({
  title,
  onPress,
  buttonColor,
  titleColor,
  buttonStyle,
  textStyle,
  fontFamily,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        ...buttonStyle,
        backgroundColor: buttonColor || "#512DA8",
      }}
      onPress={onPress}
    >
      <TextWrapper
        fontFamily={fontFamily ? fontFamily : fonts.azosans.medium}
        color={titleColor || "#FFF"}
        style={{ ...styles.title, ...textStyle, color: titleColor || "#fff" }}
      >
        {title}
      </TextWrapper>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#512DA8",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 14,
  },
});
