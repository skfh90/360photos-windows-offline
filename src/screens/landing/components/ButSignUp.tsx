import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import Text from "@shared-components/text-wrapper/TextWrapper";
import fonts from "@fonts";

interface IButSignUpProps {
  text: string;
  onPress: () => void;
}

const ButSignUp: React.FC<IButSignUpProps> = ({ text, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable
      style={{
        width: 200,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        ...styles.pressable,
        backgroundColor: isPressed ? "#59D07F" : "#000",
      }}
      onPress={onPress}
      onPressIn={() => {
        setIsPressed(true);
      }}
      onPressOut={() => {
        setIsPressed(false);
      }}
    >
      {/* <Pressable style={styles.pressable} onPress={onPress}></Pressable> */}
      <Text
        color="#fff"
        fontFamily={fonts.azosans.medium}
        style={styles.signup}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 76,
    backgroundColor: "#00140a",
  },
  signup: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});

export default ButSignUp;
