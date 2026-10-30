/* eslint-disable import/no-named-as-default-member */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Color } from "../GlobalStyles";
import HeaderItem from "./components/HeaderItem";
import MyPhotospheresItem, {
  IMyPhotospheresItemRef,
} from "./components/MyPhotospheresItem";
import SvgBand from "../../assets/band.svg";
import SvgPlusNormal from "@assets/landing/plus_normal.svg";
import SvgPlusHover from "@assets/landing/plus_hover.svg";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import Toast from "react-native-root-toast";
import axios from "axios";
import Text from "@shared-components/text-wrapper/TextWrapper";

import { RootSiblingParent } from "react-native-root-siblings";
// import BackgroundFetch from "react-native-background-fetch";
import { BlurView } from "@react-native-community/blur";

import {
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";

import { useFocusEffect } from "@react-navigation/native";
import BottomDrawer, {
  BottomDrawerMethods,
} from "react-native-animated-bottom-drawer";
import SignupItem from "./drawer/SignupItem";
import SigninItem from "./drawer/SigninItem";
import SettingsItem from "./drawer/SettingsItem";
import { getInitialize } from "../../redux/slices/authJwt";
import ModalNewCapture, { IModalNewCaptureRef } from "./modal/ModalNewCapture";
import DocumentPicker from "react-native-document-picker";
import {
  API_URL,
  BOTTOM_DRAWER_HEIGHT,
  IMAGE_URL,
  SCREENS,
} from "@shared-constants";
import AppLoading from "../../shared/components/AppLoading";
import * as NavigationService from "react-navigation-helpers";
import Policy from "@shared-components/Policy";
import fonts from "@fonts";
import RNFS, { copyFile } from "react-native-fs";

import RNFetchBlob from "rn-fetch-blob";

import ModalRename, { IModalRenameRef } from "./modal/ModalRename";
import { Platform } from "react-native";
import { generateRandomDirName } from "@screens/capture/config";
import EnlargeButtonSvg from "@shared-components/EnlargeButtonSvg";
import ForgotPasswordItem from "./drawer/ForgotPasswordItem";
import VerifyCodeItem from "./drawer/VerifyCodeItem";
import NewPasswordItem from "./drawer/NewPasswordItem";
import ThanksItem from "./drawer/ThanksItem";
import ModalNamePhotosphere, {
  IModalNamePhotosphereRef,
} from "@screens/landing/modal/ModalNamePhotosphere";
import { useHistoryManager } from "../../hooks/useHistoryManager";
import { useRealm } from "@realm/react";
import { getData, getPanoramaSrcForViewer, sleep } from "../../shared/utils";
import {
  resizeImage,
  uploadImages,
  uploadPhotosphere,
} from "../../shared/utils/aws";
import { useNetInfo } from "@react-native-community/netinfo";

const LandingScreen = ({ navigation, route }) => {
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const bottomDrawerPolicyRef = useRef<BottomDrawerMethods>(null);
  const bottomDrawerPolicyRef2 = useRef<BottomDrawerMethods>(null);
  const settingBottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const [page, setPage] = useState<number>(1);

  const myPhotospheresRef = useRef<IMyPhotospheresItemRef>(null);

  const [showAppLoading, setShowAppLoading] = useState<boolean>(false);
  const [showBlurView, setShowBlurView] = useState<boolean>(false);
  const [appLoadingText, setAppLoadingText] = useState<string>(
    "Downloading File...",
  );
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  // const videoRef = useRef<any>(null);
  // const [renameId, setRenameId] = useState<number>(-1);
  const dispatch = useDispatch();

  const {
    type: networkType,
    isConnected: networkConnected,
    details: networkDetails,
  } = useNetInfo();

  useEffect(() => {
    console.log("type => ", networkType);
    console.log("connected => ", networkConnected);
  }, [networkType, networkConnected]);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [currentWork, setCurrentWork] = useState<"login" | "signup" | "forgot">(
    "login",
  ); // login or signup or forgot

  const nameInfoRef = useRef<any>();

  useEffect(() => {
    if (route.params?.success == true && route.params?.info) {
      nameInfoRef.current = route.params?.info;
      setShowBlurView(true);
      toggleModalNamePhotosphere();
    }
  }, [route.params?.success, route.params?.info]);

  useEffect(() => {
    dispatch(getInitialize() as any);
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, []),
  );

  const modalNamePhotosphere = useRef<IModalNamePhotosphereRef>(null);
  const toggleModalNamePhotosphere = () => {
    if (modalNamePhotosphere) modalNamePhotosphere.current?.toggle();
  };

  const handleLoginSuccess = useCallback(() => {
    // if (myPhotospheresRef) myPhotospheresRef.current?.refetch();
    // getInitialize();
  }, []);

  const { user, isAuthenticated } = useSelector((state: any) => state.authJwt);

  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>("");

  const {
    addHistory,
    histories: allHistories,
    updateHistoryIsUploaded,
  } = useHistoryManager(user?.id);

  useEffect(() => {
    // initBackgroundFetch();
  }, []);

  const realm = useRealm();
  const deleteAllHistoryObjects = () => {
    realm.write(() => {
      realm.deleteAll();
    });
  };

  useEffect(() => {
    // deleteAllHistoryObjects();
  }, []);

  useEffect(() => {
    let isRunning = true;
    const backgroundTask = async () => {
      while (isRunning) {
        // console.log("========background task=====================");
        if (isAuthenticated && networkConnected) {
          // console.log("authenticated task");
          // console.log("histories length is ", allHistories.length);
          for (let index = 0; index < allHistories.length; index++) {
            const item: any = allHistories[index];
            if (item?.status != 0 || item?.is_uploaded == true) continue;

            console.log("[uploading file] ==> ", index);
            try {
              const isExist = await uploadPhotosphere(item);
              if (isExist) {
                updateHistoryIsUploaded(item, true);
              }  
            } catch (error) {              
            }
            
          }
        }
        await sleep(1000);
      }
    };
    
    backgroundTask();
    return () => {
      isRunning = false;
    };
  }, [isAuthenticated, allHistories, networkConnected]);

  const initBackgroundFetch = async () => {
    // BackgroundFetch event handler.
    // const onEvent = async (taskId: any) => {
    //   console.log("[BackgroundFetch] task: ", taskId);
    //   // Do your background work...
    //   await addEvent(taskId);
    //   // IMPORTANT:  You must signal to the OS that your task is complete.
    //   BackgroundFetch.finish(taskId);
    // };
    // // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    // const onTimeout = async (taskId: any) => {
    //   console.warn("[BackgroundFetch] TIMEOUT task: ", taskId);
    //   BackgroundFetch.finish(taskId);
    // };
    // // Initialize BackgroundFetch only once when component mounts.
    // let status = await BackgroundFetch.configure(
    //   { minimumFetchInterval: 15 },
    //   onEvent,
    //   onTimeout,
    // );
    // console.log("[BackgroundFetch] configure status: ", status);
  };

  // Add a BackgroundFetch event to <FlatList>
  const addEvent = (taskId: any) => {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise(async (resolve, _reject) => {
      await sleep(2000);
      resolve;
    });
  };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     console.log("new connection when focusing");
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const handleRename = useCallback(
    (text: string) => {
      console.log(nameInfoRef.current);
      addHistory(
        user.id,
        nameInfoRef.current.dir,
        nameInfoRef.current.camFov,
        0,
        text,
        10,
        "",
        0,
        0,
        nameInfoRef.current.netStatus,
      );
    },
    [user?.id],
  );

  const readDataFromContentUri = async (contentUri) => {
    try {
      // Read the data from the content URI
      const data = await RNFetchBlob.fs.readFile(contentUri, "base64");

      // Write the data to a temp file
      const tempFilePath = `${RNFS.TemporaryDirectoryPath}/tempfile.jpg`;
      await RNFetchBlob.fs.writeFile(tempFilePath, data, "base64");

      const fileUri = `file://${tempFilePath}`;
      return fileUri;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const pickDocumentFromFiles = async () => {
    try {
      const pickedImage = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        mimeTypes: ["image/jpeg", "image/png", "image/gif"],
        mode: "open",
      });

      let fileUri: string | null = "";
      if (Platform.OS == "android")
        fileUri = await readDataFromContentUri(pickedImage.uri);
      else fileUri = pickedImage.uri;

      const fileName = pickedImage.name;
      if (fileUri == null || fileName == undefined) {
        return;
      }
      setAppLoadingText("Uploading File...");
      setShowAppLoading(true);

      try {
        const dir = generateRandomDirName(user.id);

        const result = await uploadImages(dir, fileUri, fileName);
        if (result == "success") {
          try {
            const lastIdx = fileName.lastIndexOf(".");

            const name = fileName.slice(0, lastIdx);

            const item = {
              filepath: dir,
              fov: "-1",
              item_order: 0,
              name: name,
              no: 100,
              path: fileName,
              status: 2,
              type: 1,
            };
            addHistory(
              user.id,
              item.filepath,
              item.fov,
              item.item_order,
              item.name,
              item.no,
              item.path,
              item.status,
              item.type,
            );
            // if (myPhotospheresRef) myPhotospheresRef.current?.refetch();
            NavigationService.navigate(SCREENS.VIEWER, {
              panoramaSrc: getPanoramaSrcForViewer(item),
            });
            setShowAppLoading(false);
          } catch (error) {}
        } else {
          setShowAppLoading(false);
        }
      } catch (error) {
        setShowAppLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickDocumentFromPhotos = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: "photo",
      };
      const result = await launchImageLibrary(options);
      if (!result.didCancel) {
        if (result && result.assets && result.assets.length > 0) {
          let fileUri = result.assets[0].uri;
          const fileName = result.assets[0].fileName;
          if (fileUri == null || fileName == undefined) return;

          setAppLoadingText("Uploading File...");
          setShowAppLoading(true);

          try {
            const res = await axios.post(`${API_URL}/upload/fileInfo`, {
              user_id: user.id,
              name: fileName,
            });
            const { dir } = res.data;

            const result = await uploadImages(dir, fileUri, fileName);
            if (result == "success") {
              console.log("success");

              const lastIdx = fileName.lastIndexOf(".");

              const name = fileName.slice(0, lastIdx);

              const item = {
                filepath: dir,
                fov: "-1",
                item_order: 0,
                name: name,
                no: 100,
                path: fileName,
                status: 2,
                type: 1,
              };
              addHistory(
                user.id,
                item.filepath,
                item.fov,
                item.item_order,
                item.name,
                item.no,
                item.path,
                item.status,
                item.type,
              );
              // if (myPhotospheresRef) myPhotospheresRef.current?.refetch();
              NavigationService.navigate(SCREENS.VIEWER, {
                panoramaSrc: getPanoramaSrcForViewer(item),
              });
              setShowAppLoading(false);
            } else {
              setShowAppLoading(false);
            }
          } catch (error) {
            setShowAppLoading(false);
          }
        }
      }
    } catch (error) {}
  };

  const pickDocument = async (index: number) => {
    if (index == 1) await pickDocumentFromFiles();
    else await pickDocumentFromPhotos();
  };

  const closeBottomDrawer = () => {
    bottomDrawerRef.current?.close();
    settingBottomDrawerRef.current?.close();
  };

  useEffect(() => {
    if (showPrivacy) {
      console.log(page);
      if (isAuthenticated) {
        console.log("show policy in settings");
        bottomDrawerPolicyRef2.current?.open();
      } else {
        console.log("show policy in login");
        bottomDrawerPolicyRef.current?.open();
      }
    } else {
      bottomDrawerPolicyRef.current?.close();
      bottomDrawerPolicyRef2.current?.close();
    }
  }, [showPrivacy, isAuthenticated]);

  const showDropdown = (page: number) => {
    if (page == 3) settingBottomDrawerRef.current?.open();
    else {
      setPage(page);

      bottomDrawerRef.current?.open();
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = (text: string) => {
    console.log("show toast");
    setToastVisible(true);
    setToastText(text);

    if (timerRef.current != null) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
    // toastRef.current.show(text);
    // ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const modalNewCapture = useRef<IModalNewCaptureRef>(null);
  const toggleModal = () => {
    if (modalNewCapture) modalNewCapture.current?.toggle();
  };

  const [renameOldName, setRenameOldName] = useState("");
  const modalRename = useRef<IModalRenameRef>(null);
  const toggleRenameModal = (text: string) => {
    console.log(text);
    setRenameOldName(text);
    if (modalRename) modalRename.current?.toggle();
  };
  const renameChangeName = (text: string) => {
    if (text == renameOldName) return;
    if (modalRename) modalRename.current?.toggle();
    myPhotospheresRef.current?.rename(text);
  };

  return (
    <SafeAreaView style={styles.appHomePageNew}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={() => {
          console.log("area");
          closeBottomDrawer();
        }}
      />
      <HeaderItem
        showDropdown={showDropdown}
        onPress={() => {
          console.log("header");
          closeBottomDrawer();
        }}
      />
      <View
        style={
          Platform.OS == "ios"
            ? {
                position: "absolute",
                top: 140,
                bottom: 80,
                left: 0,
                right: 0,
                width: ScreenWidth,
                height: ScreenHeight - 200,
                // marginTop: Platform.OS == "android" ? 0 : 140,
                // marginBottom: Platform.OS == "android" ? 60 : 25,
                flex: 1,
              }
            : {
                marginTop: 0,
                marginBottom: 80,
                flex: 1,
              }
        }
      >
        <View
          style={{
            marginLeft: 15,
            marginRight: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            color="#00130A"
            style={{
              fontFamily: "Azo Sans",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: 21,
              color: "#00130A",
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            360 Photos
          </Text>
          <View
            style={{
              alignSelf: "stretch",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: 10,
              justifyContent: "center",
            }}
          >
            <EnlargeButtonSvg
              SvgNormal={SvgPlusNormal}
              SvgHover={SvgPlusHover}
              onPress={async () => {
                if (isAuthenticated) {
                  toggleModal();
                } else {
                  const hadCredential = await getData("hadCredential");
                  if (hadCredential == "yes") setPage(1);
                  else showDropdown(2);
                  bottomDrawerRef.current?.open();
                }
              }}
            />
          </View>
        </View>

        <MyPhotospheresItem
          ref={myPhotospheresRef}
          toggleModal={toggleModal}
          toggleRenameModal={toggleRenameModal}
          setAppLoadingText={setAppLoadingText}
          setShowAppLoading={setShowAppLoading}
          showToast={showToast}
          setShowBlurView={setShowBlurView}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: 70,
          left: 0,
          width: ScreenWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SvgBand />
        <Text style={{ marginTop: 7 }}>Beta v1.0 (free)</Text>
      </View>

      {showBlurView && (
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 200000000,
          }}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
      )}

      {/* {
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            width: ScreenWidth,
            height: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text color="red">
            {networkConnected +
              " " +
              networkType +
              " " +
              JSON.stringify(networkDetails)}
          </Text>
        </View>
      } */}

      <BottomDrawer
        onBackPress={() => setToastVisible(false)}
        onBackdropPress={() => setToastVisible(false)}
        ref={bottomDrawerRef}
        gestureMode="handle"
        initialHeight={BOTTOM_DRAWER_HEIGHT}
        customStyles={{
          handleContainer: {
            justifyContent: "flex-start",
            height: Platform.OS == "android" ? 120 : 60,
            zIndex: 2000000,
          },
          handle: {
            backgroundColor: "#000000",
            marginTop: 14,
            width: 60,
          },
        }}
      >
        <BottomDrawer
          onBackPress={() => setShowPrivacy(false)}
          onBackdropPress={() => setShowPrivacy(false)}
          ref={bottomDrawerPolicyRef}
          initialHeight={ScreenHeight}
        >
          <View
            style={{
              width: ScreenWidth,
              height: ScreenHeight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Policy
              backAction={() => {
                setShowPrivacy(false);
              }}
            />
          </View>
        </BottomDrawer>

        <RootSiblingParent>
          <View style={styles.contentContainer}>
            {/* <SignupItem /> */}
            {page == 1 && (
              <SigninItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
                handleLoginSuccess={handleLoginSuccess}
                closeBottomDrawer={closeBottomDrawer}
                setForgotPasswordEmail={setForgotPasswordEmail}
                setCurrentWork={setCurrentWork}
              />
            )}
            {page == 2 && (
              <SignupItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
                closeBottomDrawer={closeBottomDrawer}
                setForgotPasswordEmail={setForgotPasswordEmail}
                setCurrentWork={setCurrentWork}
              />
            )}
            {/* {page == 4 && (
              <ForgotPasswordItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
              />
            )} */}
            {page == 4 && (
              <ForgotPasswordItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
                setForgotPasswordEmail={setForgotPasswordEmail}
                setCurrentWork={setCurrentWork}
              />
            )}
            {page == 5 && (
              <VerifyCodeItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
                forgotEmail={forgotPasswordEmail}
                currentWork={currentWork}
              />
            )}

            {page == 6 && (
              <NewPasswordItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
                forgotEmail={forgotPasswordEmail}
                closeBottomDrawer={closeBottomDrawer}
              />
            )}
            {page == 7 && <ThanksItem closeBottomDrawer={closeBottomDrawer} />}
            {/* {page == 3 && (
              <SettingsItem
                setShowPrivacy={setShowPrivacy}
                showDropdown={showDropdown}
                showToast={showToast}
                closeBottomDrawer={closeBottomDrawer}
              />
            )} */}
          </View>
          <Toast
            visible={toastVisible}
            position={Toast.positions.TOP}
            shadow={true}
            animation={true}
            hideOnPress={true}
            containerStyle={{
              width: ScreenWidth - 50,
            }}
            textStyle={{
              fontFamily: fonts.azosans.regular,
            }}
            delay={0}
          >
            {toastText}
          </Toast>
        </RootSiblingParent>
      </BottomDrawer>

      <BottomDrawer
        onBackPress={() => setToastVisible(false)}
        onBackdropPress={() => setToastVisible(false)}
        ref={settingBottomDrawerRef}
        gestureMode="handle"
        initialHeight={BOTTOM_DRAWER_HEIGHT}
        customStyles={{
          handleContainer: {
            justifyContent: "flex-start",
            height: Platform.OS == "android" ? 120 : 60,
          },
          handle: {
            backgroundColor: "#000000",
            marginTop: 14,
            width: 60,
          },
        }}
      >
        <BottomDrawer
          onBackPress={() => setShowPrivacy(false)}
          onBackdropPress={() => setShowPrivacy(false)}
          ref={bottomDrawerPolicyRef2}
          initialHeight={ScreenHeight}
        >
          <View
            style={{
              width: ScreenWidth,
              height: ScreenHeight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Policy
              backAction={() => {
                setShowPrivacy(false);
              }}
            />
          </View>
        </BottomDrawer>
        <RootSiblingParent>
          <View style={styles.contentContainer}>
            <SettingsItem
              setShowPrivacy={setShowPrivacy}
              showDropdown={showDropdown}
              showToast={showToast}
              closeBottomDrawer={closeBottomDrawer}
            />
          </View>
          <Toast
            visible={toastVisible}
            position={Toast.positions.TOP}
            shadow={true}
            animation={true}
            hideOnPress={true}
            containerStyle={{
              width: ScreenWidth - 50,
            }}
            textStyle={{
              fontFamily: fonts.azosans.regular,
            }}
            delay={0}
          >
            {toastText}
          </Toast>
        </RootSiblingParent>
      </BottomDrawer>

      <Toast
        visible={toastVisible}
        position={Toast.positions.BOTTOM}
        shadow={true}
        animation={true}
        hideOnPress={true}
        containerStyle={{
          width: ScreenWidth - 50,
        }}
        textStyle={{
          fontFamily: fonts.azosans.regular,
        }}
        delay={0}
      >
        {toastText}
      </Toast>

      {/* <Modal ref={modalNewCapture}></Modal> */}
      <ModalNewCapture
        pickFile={pickDocument}
        ref={modalNewCapture}
        showDropdown={showDropdown}
        setShowBlurView={setShowBlurView}
      />
      {showAppLoading && <AppLoading text={appLoadingText} />}
      {/* {showPrivacy && <Policy backAction={() => { setShowPrivacy(!showPrivacy)}}/>} */}
      <ModalRename
        ref={modalRename}
        oldName={renameOldName}
        changeName={renameChangeName}
        setShowBlurView={setShowBlurView}
      />
      <ModalNamePhotosphere
        ref={modalNamePhotosphere}
        handleRename={handleRename}
        setShowBlurView={setShowBlurView}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  appHomePageNew: {
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default LandingScreen;
