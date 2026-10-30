import React, { useState } from "react";
import {
  TouchableHighlight,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

import TextWrapper from "./text-wrapper/TextWrapper";
import fonts from "@fonts";

interface ICustomHighlightButtonProps {
  title: string;
  onPress: () => void;
  buttonColor?: string;
  titleColor?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  fontFamily?: string;
}

const CustomHighlightButton: React.FC<ICustomHighlightButtonProps> = ({
  title,
  onPress,
  buttonColor,
  titleColor,
  buttonStyle,
  textStyle,
  fontFamily,
}) => {
  const [textColor, setTextColor] = useState(titleColor);
  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor={"#FFF"}
      onShowUnderlay={() => setTextColor("#000")}
      onHideUnderlay={() => setTextColor("#FFF")}
      style={{
        ...styles.container,
        ...buttonStyle,
        backgroundColor: buttonColor || "#512DA8",
      }}
      onPress={onPress}
    >
      <TextWrapper
        fontFamily={fontFamily ? fontFamily : fonts.azosans.medium}
        color={textColor || "#FFF"}
        style={{ ...styles.title, ...textStyle, color: titleColor || "#fff" }}
      >
        {title}
      </TextWrapper>
    </TouchableHighlight>
  );
};

export default CustomHighlightButton;

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
