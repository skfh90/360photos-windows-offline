/* eslint-disable camelcase */
import React, { useRef, useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";

import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";

import EnlargeButton, {
  IEnlargeButtonItemRef,
} from "@shared-components/EnlargeButton";
import Orientation from "react-native-orientation-locker";
import AppLoadingForViewer from "@shared-components/AppLoadingForViewer";
import { getDirectoryPath } from "../../shared/utils";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";
const fs = RNFetchBlob.fs;

interface ViewerScreenProps {}

interface IPositionProps {
  yaw: number;
  pitch: number;
}

const ViewerScreen: React.FC<ViewerScreenProps> = ({ route }) => {
  const webviewRef = useRef<WebView>(null);

  const positionRef = useRef<IPositionProps>({
    yaw: 0,
    pitch: 0,
  });

  const playButtonRef = useRef<IEnlargeButtonItemRef>(null);
  const photoButtonRef = useRef<IEnlargeButtonItemRef>(null);

  useEffect(() => {
    Orientation.unlockAllOrientations();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const [showAppLoading, setShowAppLoading] = useState(true);

  useEffect(() => {
    if (route.params?.panoramaSrc) {
      console.log(route.params?.panoramaSrc);
    }
  }, [route.params?.panoramaSrc]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <WebView
        ref={webviewRef}
        // originWhitelist={["*"]}
        injectedJavaScriptBeforeContentLoaded={`
          window.onerror = function(message, sourcefile, lineno, colno, error) {
            alert("Message: " + message + " - Source: " + sourcefile + " Line: " + lineno + ":" + colno);
            return true;
          };
          true;
        `}
        webviewDebuggingEnabled
        // source={localHtmlFile}
        // let initiateSource = Platform.OS === 'ios'
        // ? require('../../assets/html/LxHtmlEditor.html')
        // : { uri: 'file:///android_asset/html/LxHtmlEditor.html', baseurl: 'file:///android_asset/html' }
        source={
          Platform.OS === "ios"
            ? {
                uri: "viewer/viewer.html",
                baseUrl: "viewer",
              }
            : {
                uri: "file:///android_asset/viewer/viewer.html",
                baseUrl: "file:///android_asset/viewer",
              }
        }
        style={{ flex: 1 }}
        onLoadEnd={() => {

          RNFS.readFile(route.params?.panoramaSrc, "base64")
          .then((base64) => {
            let base64Data = base64;
            if (!base64Data.startsWith("data:")) {
              console.log("OKKKKKK");
              base64Data = "data:image/jpeg;base64," + base64Data;
            }
            webviewRef.current?.postMessage(base64Data);
          })
          .catch((err) => {console.log("err ==> ", err)});

          // RNFetchBlob.config({
          //   fileCache: true,
          // })
          //   .fetch("GET", route.params?.panoramaSrc) // the file is now downloaded at local storage
          //   .then((resp) => {
          //     return resp.readFile("base64"); // to get the base64 string
          //   })
          //   .then((base64) => {
          //     let base64Data = base64;
          //     if (!base64Data.startsWith("data:")) {
          //       console.log("OKKKKKK");
          //       base64Data = "data:image/jpeg;base64," + base64Data;
          //     }
          //     webviewRef.current?.postMessage(base64Data);
          //   })
          //   .catch((err) => {console.log("err ==> ", err)});
        }}
        onMessage={(e) => {
          const { data } = e.nativeEvent;
          const jsonData = JSON.parse(data);

          if (jsonData.status == "Loading End") {
            setTimeout(() => {
              webviewRef.current?.postMessage("autorotate");
              setShowAppLoading(false);
            }, 500);
          } else if (jsonData.status == "autorotate") {
            playButtonRef.current?.toggle(jsonData.data);
          } else if (jsonData.status == "gyroscope") {
            photoButtonRef.current?.toggle(jsonData.data);
          } else {
            positionRef.current = JSON.parse(data);
          }
        }}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
        // allowFileAccess={true}
        // allowFileAccessFromFileURLs={true}
        // allowUniversalAccessFromFileURLs={true}
        startInLoadingState
        originWhitelist={["file://"]}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccess={true}
      />
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 15,
        }}
      >
        <EnlargeButton
          leftMargin={10}
          topMargin={10}
          isToggleButton
          butWidth={80}
          normalPath={require("../../assets/photosphere_normal.png")}
          hoverPath={require("../../assets/photosphere_hover.png")}
          ref={photoButtonRef}
          onPress={() => {
            webviewRef.current?.postMessage("gyroscope");
          }}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 35,
          left: 80,
        }}
      >
        <EnlargeButton
          ref={playButtonRef}
          leftMargin={10}
          topMargin={10}
          isToggleButton
          butWidth={80}
          normalPath={require("../../assets/play_normal.png")}
          hoverPath={require("../../assets/play_hover.png")}
          onPress={() => {
            webviewRef.current?.postMessage("autorotate");
          }}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 35,
          right: 20,
        }}
      >
        <EnlargeButton
          leftMargin={10}
          topMargin={10}
          isToggleButton
          butWidth={70}
          normalPath={require("../../assets/close_normal.png")}
          hoverPath={require("../../assets/close_hover.png")}
          onPress={() => {
            NavigationService.navigate(SCREENS.LANDING);
          }}
        />
      </View>

      {showAppLoading && (
        <AppLoadingForViewer text="LOADING 360 VIEW..." showExitButton />
      )}
    </View>
  );
};

export default ViewerScreen;
