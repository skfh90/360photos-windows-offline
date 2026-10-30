import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
// import Image from "react-native-image-lazy-loading";
import Text from "./text-wrapper/TextWrapper";
import * as NavigationService from "react-navigation-helpers";
import SvgClose from "../../assets/GuideClose.svg";

interface IAppLoadingForViewerProps {
  text: string;
  progressText?: string;
  showContent?: boolean;
  showExitButton?: boolean;
}

const AppLoadingForViewer: React.FC<IAppLoadingForViewerProps> = ({
  text,
  progressText,
  showContent = true,
  showExitButton = false,
}) => {
  return (
    <View style={(StyleSheet.absoluteFill, styles.container)}>
      {showContent && (
        <>
          <Image
            style={styles.image}
            source={require("../../assets/landing/360-Loader-400px.gif")}
          />
          <Text color="#FFF" style={styles.text}>
            {text}
          </Text>
          {progressText && progressText != "" && (
            <Text color="#FFF" style={styles.text}>
              {progressText}
            </Text>
          )}
        </>
      )}
      {showExitButton && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 30,
            top: 30,
            width: 30,
            height: 30,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            NavigationService.goBack();
          }}
        >
          <SvgClose />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00140A",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10000000,
  },
  image: {
    width: 75,
    height: 75,
  },
  text: {
    fontFamily: "Azo Sans",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 22,
    lineHeight: 28,
    color: "#FFFFFF",
    marginTop: 30,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
});

export default AppLoadingForViewer;
