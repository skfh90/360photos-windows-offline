import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  View,
  GestureResponderEvent,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { IMAGE_URL, SCREENS, API_URL } from "@shared-constants";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import * as NavigationService from "react-navigation-helpers";
import DropdownMenu from "./DropdownMenu";
import RNFetchBlob from "rn-fetch-blob";
import ModalDelete, { IModalDeleteRef } from "../modal/ModalDelete";
import {
  existFileInDirectory,
  getData,
  getDirectoryPath,
  getPanoramaSrcForViewer,
  getPhotosphereName,
} from "../../../shared/utils";
import axios from "axios";
import LoadingItem from "./LoadingItem";
import { IEnlargeButtonItemRef } from "@shared-components/EnlargeButton";
import { History } from "../../../models/history";

let PermissionsAndroidModule: any = null;
if (Platform.OS == "android") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PermissionsAndroid } = require("react-native");
  PermissionsAndroidModule = PermissionsAndroid;
}

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IPhotosphereItemProps {
  isLocal?: boolean;
  source: any;
  style?: CustomStyleProp;
  //   data: IPhotosphereItem;
  item?: any;
  setShowAppLoading: (show: boolean) => void;
  setShowBlurView: (show: boolean) => void;
  setAppLoadingText: (text: string) => void;
  showRenameModal: (item: any, text: string, index: number) => void;
  renameItemInUI: (item: any, name: string) => void;
  localName?: string;
  deleteItem: (item: any) => void;
  showToast: (text: string) => void;
  index: number;
  onDeleteHistory?: (history: History) => void;
  onUpdateName?: (history: History, newName: string) => void;
  isCompleted: boolean;
}

export interface IPhotosphereItemRef {
  rename: (text: string) => void;
  checkStatus: () => void;
}

// eslint-disable-next-line react/display-name
const PhotosphereItem = React.memo(
  forwardRef<IPhotosphereItemRef, IPhotosphereItemProps>(
    (
      {
        isLocal = true,
        source,
        item,
        localName,
        setShowBlurView,
        showRenameModal,
        renameItemInUI,
        showToast,
        index,
        onDeleteHistory,
        onUpdateName,
        isCompleted,
      },
      ref,
    ) => {
      //   const styles = useMemo(() => createStyles(theme), [theme]);

      //   const { name, description, language, star, fork } = data;

      // const modalRename = useRef<IModalRenameRef>(null);
      const modalDelete = useRef<IModalDeleteRef>(null);
      const [selectedItem, setSelectedItem] = useState<any>(null);
      const [menuVisible, setMenuVisible] = useState(false);
      const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

      const [isProcessing, setIsProcessing] = useState<boolean>(false);
      const [isPhotosphereExist, setPhotosphereExist] = useState<boolean>(false);

      // useEffect(() => {
      //   existFileInDirectory(getDirectoryPath() + "/" + item.filepath, getPhotosphereName(item))
      //   .then((exist) => {
      //     if (exist) setCompleted(true);
      //   })
      //   .catch((err) => console.log(err));

      // }, [item])

      const checkStatus = () => {
        existFileInDirectory(
          getDirectoryPath() + "/" + item.filepath,
          getPhotosphereName(item),
        )
          .then((exist) => {
            // if (exist) setCompleted(true);
          })
          .catch((err) => console.log(err));
      };

      useEffect(() => {
        existFileInDirectory(
          getDirectoryPath() + "/" + item.filepath,
          getPhotosphereName(item),
        )
          .then((exist) => {
            if (exist) setPhotosphereExist(true);
          })
          .catch((err) => console.log(err));
      }, [])

      // const toggleModal = () => {
      //   if (modalRename) modalRename.current?.toggle();
      // };

      const toggleDeleteModal = () => {
        if (modalDelete) modalDelete.current?.toggle();
      };

      const showBlurView = (show: boolean) => {
        setShowBlurView(show);
      };

      const handleOpenMenu = (event: GestureResponderEvent) => {
        // toggleDeleteModal();
        console.log("handle open menu");
        setModalPosition({
          x: event.nativeEvent.pageX,
          y:
            event.nativeEvent.pageY + 250 > ScreenHeight
              ? event.nativeEvent.pageY - event.nativeEvent.locationY - 250
              : event.nativeEvent.pageY - event.nativeEvent.locationY,
        });
        showBlurView(true);
        setMenuVisible(true);
        // setMenuBottom(event.nativeEvent.layout.y);
        // console.log(event);
      };

      const onCloseWithoutBlur = () => {
        setMenuVisible(false);
      };

      const onCloseWithBlur = () => {
        showBlurView(false);
        setMenuVisible(false);
      };

      const getPhotoFullName = (item: any) => {
        const prefix = IMAGE_URL + "/uploads/" + item.filepath + "/";
        if (item.type == 1) return prefix + item.path;
        if (item.status == 2) return prefix + "photo360.jpg";
        else return prefix + "error.jpg";
      };

      const openDoSpaceSite = async () => {
        //https://studio.dospace.tech?image_url='https://360app.dospace.tech//sample.jpg'
        // const url = `https://api.dospace.tech/custom-sphere?image_url='${imageUrl}'`;
        const url = "https://www.dospace.tech";
        Linking.openURL(url);
      };

      const handleItemPress = (type: string, item: any) => {
        setSelectedItem(item);
        // console.log(`Selected item: ${item}`);
        // downloadFile();
        // downloadImage("eee", "test");

        if (type == "seeindospace") {
          onCloseWithBlur();
          openDoSpaceSite();
        }

        if (type == "download") {
          onCloseWithBlur();
          downloadImageIfPermissionGranted(getPhotoFullName(item), item.name);
        }

        if (Platform.OS == "android") {
          onCloseWithoutBlur();
          if (type == "rename") showRenameModal(item, item?.name, index);
          if (type == "delete") toggleDeleteModal();
        }

        if (Platform.OS == "ios") {
          onCloseWithoutBlur();
          setTimeout(() => {
            if (type == "rename") showRenameModal(item, item?.name, index);
            if (type == "delete") toggleDeleteModal();
          }, 1000);
        }
      };

      const deletePhotoItem = async () => {
        if (onDeleteHistory != undefined) onDeleteHistory(item);
        showToast("Successfully deleted!");
        // setIsProcessing(true);
        // const accessToken = await getData("accessToken");

        // try {
        //   const res: any = await axios.delete(
        //     `${API_URL}/upload/history/${selectedItem.no}`,
        //     {
        //       headers: {
        //         Authorization: accessToken,
        //       },
        //     },
        //   );
        //   if (res.status == 200 && res.data.type == "success") {
        //     showToast("Successfully deleted!");
        //     deleteItem(selectedItem);
        //   } else {
        //     showToast("Unknown Error!");
        //   }
        //   setIsProcessing(false);
        // } catch (error) {
        //   setIsProcessing(false);
        // }
      };

      const downloadImageIfPermissionGranted = async (
        url: string,
        fileName: string,
      ) => {
        setIsProcessing(true);
        try {            
            await downloadImage(url, fileName);
          } catch (err) {
            console.warn(err);
        }
        setIsProcessing(false);
      };

      const downloadImage = (url: string, fileName: string): Promise<void> => {       
        return new Promise((resolve, reject) => {
          const exts = getExtention(url);
          let ext = "";
          if (exts != undefined) ext = "." + exts[0];

          const { config } = RNFetchBlob;

          let dirs = RNFetchBlob.fs.dirs;
          let path =
            Platform.OS === "ios"
              ? dirs.DocumentDir + "/Images/" + fileName + ext
              : dirs.PictureDir + "/" + fileName + ext;

          let options = {};

          if (Platform.OS == "ios")
            options = {
              fileCache: true,
              path: path,
              appendExt: "jpg",
            };
          else
            options = {
              fileCache: true,
              addAndroidDownloads: {
                // Related to the Android only
                useDownloadManager: true,
                notification: true,
                path: path,
                description: "Downloading " + fileName + ext,
              },
              path: path,
            };
          config(options)
            .fetch("GET", url)
            .then(() => {
              // Showing alert after successful downloading
              // setShowAppLoading(false);
              // alert("Image Downloaded Successfully.");
              if (Platform.OS == "ios") {
                CameraRoll.save("file://" + path)
                  .then(() => {
                    showToast("Image Downloaded Successfully.");
                    resolve();
                  })
                  .catch(() => {
                    showToast("Image storage has been cancled.");
                    resolve();
                  });
              } else {
                showToast("Image Downloaded Successfully.");
                resolve();
              }
            })
            .catch((e) => reject(e));
        });
      };

      const getExtention = (filename: string) => {
        // To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
      };

      const changeName = async (newPhotoName: string) => {
        if (newPhotoName == item.name) return;
        if (onUpdateName != undefined) onUpdateName(item, newPhotoName);
        showToast("Successfully updated!");
        // setIsProcessing(true);
        // try {
        //   const accessToken = await getData("accessToken");

        //   const res: any = await axios.post(
        //     `${API_URL}/upload/history/${selectedItem.no}`,
        //     {
        //       name: newPhotoName,
        //       isNew: "no",
        //     },
        //     {
        //       headers: {
        //         Authorization: accessToken,
        //         timeout: 2000,
        //       },
        //     },
        //   );

        //   if (res.status == 200 && res.data.type == "success") {
        //     setTimeout(() => {
        //       renameItemInUI(selectedItem, newPhotoName);
        //       setIsProcessing(false);
        //       showToast("Successfully updated!");
        //     }, 1500);
        //   } else {
        //     setTimeout(() => {
        //       setIsProcessing(false);
        //       showToast("Unknown Error!");
        //     }, 1500);
        //   }
        // } catch (error) {
        //   console.log(error);
        //   setIsProcessing(false);
        // }
      };

      useImperativeHandle(ref, () => ({
        rename: (text: string) => {
          changeName(text);
        },
        checkStatus: () => {
          checkStatus();
        },
      }));

      const toggleItem = () => {
        if (openButtonRef.current) openButtonRef.current?.toggle(false);
      };

      const openButtonRef = useRef<IEnlargeButtonItemRef>(null);

      if ((isProcessing || isCompleted === false) && !isPhotosphereExist)
        return <LoadingItem item={item} />;
      return (
        <View
          style={
            {
              // borderBlockColor:'grey',
              // borderWidth:2,
            }
          }
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: (ScreenWidth - 30) / 2,
              height: (ScreenWidth - 30) / 4,
              // backgroundColor: "#FFFFFF",
              borderRadius: 8,
              margin: 0,
            }}
            onPress={() => {
              NavigationService.navigate(SCREENS.VIEWER, {
                panoramaSrc: getPanoramaSrcForViewer(item),
              });
            }}
          >
            <DropdownMenu
              visible={menuVisible}
              isLocal={isLocal}
              source={source}
              onClose={onCloseWithoutBlur}
              onCloseWithBlur={onCloseWithBlur}
              onItemPress={handleItemPress}
              // top={modalPosition.y}
              // left={modalPosition.x}
              item={item}
              toggleItem={toggleItem}
              index={index}
            />
            {/* {isLocal && localName == "Vacation Foyer" && (
          <Image
            source={require("../../../assets/landing/int-thumbnail.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 4,
            }}
          />
        )} */}

            <Image
              source={{
                uri: `file://${getDirectoryPath()}/${
                  item.filepath
                }/thumbnail.jpg`,
              }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 4,
              }}
            />

            {item.no > 0 && (
              <>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    paddingRight: 3,
                    paddingBottom: 3,
                    paddingTop: 10,
                    paddingLeft: 10,
                    zIndex: 100,
                  }}
                >
                  {/* <EnlargeButtonSvg
                /// <reference path="" />
                ref={openButtonRef}
                SvgNormal={SvgDropdownNormal}
                SvgHover={SvgDropdownUp}
                onPress={handleOpenMenu}
              /> */}
                </View>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleOpenMenu}
                  style={{
                    width: 60,
                    height: 30,
                    right: 0,
                    position: "absolute",
                    bottom: 0,
                    zIndex: 100,
                  }}
                >
                  <Image
                    source={require("../../../assets/threedot.png")}
                    style={{
                      width: 40,
                      height: 20,
                      position: "absolute",
                      bottom: 2,
                      right: 0,
                    }}
                  />
                </TouchableOpacity>

                <DropdownMenu
                  isLocal={isLocal}
                  source={source}
                  visible={menuVisible}
                  onClose={onCloseWithoutBlur}
                  onCloseWithBlur={onCloseWithBlur}
                  onItemPress={handleItemPress}
                  top={modalPosition.y}
                  left={modalPosition.x}
                  item={item}
                  index={index}
                  toggleItem={toggleItem}
                />
              </>
            )}

            <Text
              color="#FFFFFF"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: 13,
                lineHeight: 16,
                color: "#FFFFFF",
                textShadowColor: "rgba(0, 0, 0, 0.8)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
                position: "absolute",
                bottom: 6,
                left: 6,
                width: ScreenWidth / 2 - 45,
              }}
            >
              {item.name}
            </Text>

            <ModalDelete
              deletePhotoItem={deletePhotoItem}
              ref={modalDelete}
              setShowBlurView={showBlurView}
            />
          </TouchableOpacity>
        </View>
      );
    },
  ),
);

export default PhotosphereItem;
