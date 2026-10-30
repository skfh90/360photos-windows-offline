import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import SvgDropdownNormal from "../../../assets/landing/dropdown_normal.svg";
import SvgDropdownUp from "../../../assets/landing/dropdown_up.svg";
import { GestureResponderEvent } from "react-native-modal";

interface HamburgerMenuProps {
  onPress: (event: GestureResponderEvent) => void;
}

const HamburgerMenu = ({ onPress }: HamburgerMenuProps) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <TouchableOpacity
      onPress={(event: GestureResponderEvent) => {
        onPress(event);
      }}
      onPressIn={() => {
        console.log("on press in");
        setIsPressed(true);
      }}
      onPressOut={() => {
        console.log("on press out");
        setIsPressed(false);
      }}
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        padding: 3,
        zIndex: 100,
      }}
    >
      {/* <Image source={require("./hamburger.png")} /> */}
      {isPressed && <SvgDropdownUp />}
      {!isPressed && <SvgDropdownNormal />}
    </TouchableOpacity>
  );
};

export default HamburgerMenu;
