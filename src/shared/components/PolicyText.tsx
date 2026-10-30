import React from "react";

import { StyleSheet, TextProps, TextStyle } from "react-native";
import Text from "./text-wrapper/TextWrapper";

interface IPolicyTextProps extends TextProps {
  style?: TextStyle;
}

const PolicyText: React.FC<IPolicyTextProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <Text color="#000" {...rest} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Define your custom text styles here
    fontSize: 13,
    color: "black",
    marginBottom: 10,
  },
});

export default PolicyText;
