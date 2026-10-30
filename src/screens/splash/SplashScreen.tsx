import React, {useEffect} from "react";
import { StyleSheet, View, Platform } from "react-native";
/**
 * ? Local Imports
 */
import Video from "react-native-video";
import { SCREENS } from "@shared-constants";
import * as NavigationService from "react-navigation-helpers";

interface SplashScreenProps {}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  useEffect(() => {
    console.log("splash screen ==>")
  }, [])
  return (
    <View style={styles.container}>
      <Video
        source={
          Platform.OS == "android"
            ? require("../../assets/splash/360_Photo_Splash.mp4")
            : require("../../assets/splash/360_Photo_Splash_ios.mp4")
        }
        resizeMode="cover"
        style={styles.video}
        muted={true}
        // autoplay={true}
        onError={(err) => {
          console.log("error: ", err);
          NavigationService.navigate(SCREENS.LANDING);
        }}
        onLoad={() => {
          console.log("load");
        }}
        onEnd={() => {
          NavigationService.navigate(SCREENS.LANDING);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
});
export default SplashScreen;
