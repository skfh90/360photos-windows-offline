/* eslint-disable react/display-name */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, Pressable, GestureResponderEvent } from "react-native";

interface IEnlargeButtonProps {
  SvgNormal: React.Component;
  SvgHover: React.Component;
  onPress: (event: GestureResponderEvent) => void;
}

export interface IEnlargeButtonItemRef {
  toggle: (flag: boolean) => void;
}

const EnlargeButtonSvg = forwardRef<IEnlargeButtonItemRef, IEnlargeButtonProps>(
  ({ SvgNormal, SvgHover, onPress }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isToggle, setIsToggle] = useState(false);

    useImperativeHandle(ref, () => ({
      toggle: (flag: boolean) => {
        setIsToggle(flag);
      },
    }));

    return (
      <Pressable
        style={[styles.button, isPressed && styles.clickedButton]}
        //   onPress={handlePress}
        onPressIn={() => {
          console.log("on press in");
          setIsPressed(true);
        }}
        onPressOut={() => {
          setIsPressed(false);
        }}
        onPress={(event: GestureResponderEvent) => {
          onPress(event);
          // setIsToggle(!isToggle);
        }}
      >
        {isPressed && <SvgHover />}
        {!isPressed && !isToggle && <SvgNormal />}
        {!isPressed && isToggle && <SvgHover />}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  clickedButton: {
    // backgroundColor: "green",
    transform: [{ scale: 1.1 }],
    transformOrigin: "center",
  },
});

export default EnlargeButtonSvg;
