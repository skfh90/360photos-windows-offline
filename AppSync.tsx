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

import { AppProvider, RealmProvider, UserProvider } from "@realm/react";
import { schemas } from "./src/models";
import { PublicLogin } from "./src/shared/components/PublicLogin";
import { Loading } from "./src/shared/components/Loading";
import { Task } from "./src/models/task";
import { History } from "./src/models/history";
import { OpenRealmBehaviorType } from "realm";
import { addEventListener } from "@react-native-community/netinfo";

type AppSyncProps = {
  appId: string;
};

const AppSync = ({ appId }: AppSyncProps) => {
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

  return (
    <AppProvider id={appId}>
      <StatusBar hidden />
      <RootSiblingParent>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <UserProvider fallback={PublicLogin}>
              <RealmProvider
                schema={schemas}
                fallback={Loading}
                sync={{
                  flexible: true,
                  // To sync data to the device, we need to subscribe to our tasks.
                  initialSubscriptions: {
                    update: (mutableSubs, realm) => {
                      console.log("==============>>>>>>>>");
                      console.log("mutable updates ===== >");
                      mutableSubs.add(realm.objects(History), {
                        name: "myHistories",
                      });
                      mutableSubs.add(realm.objects(Task), { name: "myTasks" });
                    },
                  },
                  // We can specify the behavior when opening a Realm for the first time
                  // (`newRealmFileBehavior`) and for subsequent ones (`existingRealmFileBehavior`).
                  // If the user has logged in at least 1 time before, the Realm and its data will
                  // exist on disk and can be opened even when offline. We can either (a) open the
                  // Realm immediately (or first create a new empty Realm file if it does not
                  // exist before opening it) and sync the data to the device in the background
                  // (`OpenRealmBehaviorType.OpenImmediately`), or (b) wait for any non-synced
                  // data to be fully downloaded (`OpenRealmBehaviorType.DownloadBeforeOpen`).
                  // For more possible configurations of new and existing Realm file behaviors, see:
                  // https://www.mongodb.com/docs/realm-sdks/js/latest/types/OpenRealmBehaviorConfiguration.html
                  newRealmFileBehavior: {
                    type: OpenRealmBehaviorType.DownloadBeforeOpen,
                  },
                  existingRealmFileBehavior: {
                    type: OpenRealmBehaviorType.OpenImmediately,
                  },
                }}
              >
                <Navigation />
              </RealmProvider>
            </UserProvider>
          </PersistGate>
        </Provider>
      </RootSiblingParent>
    </AppProvider>
  );
};

export default AppSync;
