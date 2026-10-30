import React from "react";
import { Linking, Platform, useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "@shared-constants";
import { DarkTheme, LightTheme } from "@theme/themes";
// ? Screens
import CaptureScreen from "@screens/capture/CaptureScreen";
import LandingScreen from "@screens/landing/LandingScreen";
import SplashScreen from "@screens/splash/SplashScreen";
import ViewerScreen from "@screens/viewer/ViewerScreen";
import GuideScreen from "@screens/guide/GuideScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ? If you want to use stack or tab or both
const Stack = createStackNavigator();
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString ? JSON.parse(savedStateString) : undefined;

          if (state !== undefined) {
            console.log("state ====> ", state);
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: false }}
      >
        {/* <Stack.Screen name={SCREENS.SPLASH}>
          {(props) => <SplashScreen {...props} onFinish={() => {}} />}
        </Stack.Screen> */}
        {/* <Stack.Screen name={SCREENS.Test}>
          {(props) => <TestModal />}
        </Stack.Screen> */}
        <Stack.Screen name={SCREENS.SPLASH}>
          {(props) => <SplashScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.LANDING}>
          {(props) => <LandingScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.VIEWER}>
          {(props) => <ViewerScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.GUIDE}>
          {(props) => <GuideScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.Capture}>
          {(props) => <CaptureScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
