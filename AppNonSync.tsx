import React, { useEffect, useRef, useState } from "react";
import { StatusBar, useColorScheme, LogBox, Platform } from "react-native";
import SplashScreen from "react-native-splash-screen";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { isAndroid } from "@freakycoder/react-native-helpers";

// import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./src/redux/store";
import { Provider } from "react-redux";
import FullScreenChz from "react-native-fullscreen-chz";
import { RootSiblingParent } from "react-native-root-siblings";
import Orientation from "react-native-orientation-locker";
import { backgroundTask } from "./src/shared/utils/tasks";

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreAllLogs();

import { RealmProvider } from "@realm/react";
import { schemas } from "./src/models";
import { addEventListener } from "@react-native-community/netinfo";

const AppNonSync = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  ////
  useEffect(() => {
    // FullScreen.enable();
    Orientation.lockToPortrait();

    if (FullScreenChz) FullScreenChz.enable();
    return () => {
      if (FullScreenChz) FullScreenChz.disable();
    };
  }, []);

  useEffect(() => {
    // Subscribe
    const unsubscribe = addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
      StatusBar.setHidden(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, [scheme, isDarkMode]);

  useEffect(() => {
    console.log("background task----");
    // backgroundTask();
  }, []);

  return (
    <RealmProvider schema={schemas} deleteRealmIfMigrationNeeded>
      <StatusBar hidden />
      <RootSiblingParent>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
          </PersistGate>
        </Provider>
      </RootSiblingParent>
    </RealmProvider>
  );
};

export default AppNonSync;
