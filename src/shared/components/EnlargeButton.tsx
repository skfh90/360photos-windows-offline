/* eslint-disable react/display-name */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, Pressable, Image, View } from "react-native";

interface IEnlargeButtonProps {
  onPress: () => void;
  normalPath: any;
  hoverPath: any;
  leftMargin: number;
  topMargin: number;
  butWidth: number;
  isToggleButton: boolean;
}

export interface IEnlargeButtonItemRef {
  toggle: (flag: boolean) => void;
}

const EnlargeButton = forwardRef<IEnlargeButtonItemRef, IEnlargeButtonProps>(
  (
    {
      onPress,
      normalPath,
      hoverPath,
      leftMargin,
      topMargin,
      butWidth = 100,
      isToggleButton = true,
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isToggle, setIsToggle] = useState(false);

    useImperativeHandle(ref, () => ({
      toggle: (flag: boolean) => {
        setIsToggle(flag);
      },
    }));

    return (
      <View
        style={[styles.button, isPressed && styles.clickedButton]}
        //   onPress={handlePress}
      >
        <Pressable
          style={{
            position: "absolute",
            top: topMargin,
            left: leftMargin,
            width: butWidth - leftMargin * 2,
            height: butWidth - topMargin * 2,
            zIndex: 100,
          }}
          onPressIn={() => {
            console.log("on press in");
            setIsPressed(true);
          }}
          onPressOut={() => {
            setIsPressed(false);
          }}
          onPress={() => {
            console.log("on press in");
            setIsToggle(!isToggle);
            onPress();
          }}
        />

        {isPressed && (
          <Image
            style={{
              width: butWidth,
              height: butWidth,
            }}
            source={hoverPath}
          />
        )}
        {isToggleButton && !isPressed && !isToggle && (
          <Image
            style={{
              width: butWidth,
              height: butWidth,
            }}
            source={normalPath}
          />
        )}
        {isToggleButton && !isPressed && isToggle && (
          <Image
            style={{
              width: butWidth,
              height: butWidth,
            }}
            source={hoverPath}
          />
        )}
        {!isToggleButton && !isPressed && (
          <Image
            style={{
              width: butWidth,
              height: butWidth,
            }}
            source={normalPath}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    position: "relative",
  },
  clickedButton: {
    // backgroundColor: "green",
    transform: [{ scale: 1.1 }],
    transformOrigin: "center",
  },
});

export default EnlargeButton;
