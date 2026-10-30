import React, { useState } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "@shared-components/text-wrapper/TextWrapper";

import fonts from "@fonts";
import SvgEyeOn from "../../assets/eye-on.svg";
import SvgEyeOff from "../../assets/eye-off.svg";

interface ICustomTextInputProps {
  setText: (text: string) => void;
  secureTextEntry?: boolean;
  initialValue?: string;
  inValid?: boolean;
  errorMessage?: string;
  isFocused: boolean,
  onFocus?: () => void;
}

const CustomTextInput: React.FC<ICustomTextInputProps> = ({
  setText,
  secureTextEntry = false,
  initialValue,
  inValid = false,
  errorMessage = "",
  isFocused = false,
  onFocus
}) => {
  const [isSecure, setIsSecure] = useState(true);

  const onEyePress = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View>
      <View style={styles.justifyInRowSpace}>
        <TextInput
          placeholderTextColor={"#ddd"}
          style={[
            styles.input,
            isFocused && styles.focused,
            !secureTextEntry && styles.nopadding,
            inValid && styles.invalidStyle,
          ]}
          onFocus={onFocus}
          secureTextEntry={secureTextEntry ? isSecure : false}
          defaultValue={initialValue}
          onChangeText={(text) => setText(text)}
          editable={true}
        ></TextInput>

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => onEyePress()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 40,
              position: "absolute",
              right: 0,
            }}
          >
            {isSecure && <SvgEyeOff width="20" />}

            {!isSecure && <SvgEyeOn width="20" />}
          </TouchableOpacity>
        )}
      </View>
      {inValid && (
        <View>
          <Text
            color="red"
            style={{
              marginTop: 5,
              fontSize: 12,
            }}
          >
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(0, 20, 10, 0.1)",
    fontFamily: fonts.azosans.regular,
    fontSize: 14,
    color: "#00140a",
    paddingEnd: 36,
    paddingStart: 10,
    height: 40,
    width: "100%",
  },
  focused: {
    borderBottomColor: "#59D07F",
    borderBottomWidth: 4,
  },
  invalidStyle: {
    borderColor: "#FF6161",
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  nopadding: {
    paddingEnd: 10,
  },
  justifyInRowSpace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
