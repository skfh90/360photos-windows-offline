import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import SvgDownload from "../../../assets/menu/download.svg";
import SvgDelete from "../../../assets/menu/delete.svg";
import SvgRename from "../../../assets/menu/rename.svg";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import fonts from "@fonts";
import { IMAGE_URL, SCREENS } from "@shared-constants";
import * as NavigationService from "react-navigation-helpers";

interface DropdownMenuProps {
  item: any;
  isLocal: boolean;
  visible: boolean;
  source: any;
  onClose: () => void;
  onCloseWithBlur: () => void;
  onItemPress: (type: string, item: any) => void;
  top: number;
  left: number;
  toggleItem: () => void;
  index: number;
}

const DropdownMenu = ({
  visible,
  isLocal,
  source,
  onCloseWithBlur,
  onItemPress,
  toggleItem,
  item,
  index
}: DropdownMenuProps) => {
  useEffect(() => {
    if (!visible) toggleItem();
  }, [visible]);

  const getPhotoFullName = (item: any) => {
    const prefix = IMAGE_URL + "/uploads/" + item.filepath + "/";
    if (item.type == 1) return prefix + item.path;
    if (item.status == 2) return prefix + "photo360.jpg";
    else return prefix + "error.jpg";
  };

  const getPanoramaSrc = () => {
    return getPhotoFullName(item);
  };

  const date2string = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${month}.${day}.${year % 100}`;
  };


  return (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      useNativeDriverForBackdrop={true}
      deviceHeight={ScreenHeight}
      backdropColor="transparent"
      onBackdropPress={onCloseWithBlur}
      onBackButtonPress={onCloseWithBlur}
      backdropOpacity={0.1}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            position: "relative",
          },
        ]}
      >
        <View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              marginTop: 10,
            }}
            onPress={() => {
              onCloseWithBlur()
              NavigationService.navigate(SCREENS.VIEWER, {
                panoramaSrc: getPanoramaSrc(),
              });
            }}
          >
          {isLocal && (
            <Image
              source={item.path}
              style={{
                width: ScreenWidth * 4/5,
                height: (ScreenWidth - 40) / 2,
                borderRadius: 10,
                shadowRadius: 4,
              }}
            />)
          }
          {!isLocal && (
            <Image
              source={{ uri: source }}
              style={{
                width: ScreenWidth * 4/5,
                height: (ScreenWidth - 40) / 2,
                borderRadius: 10,
                shadowRadius: 4,
              }}
            />)
          }
          </TouchableOpacity>
          <View
            style={{
              width: ScreenWidth * 3/5,
              marginTop: 10,
              borderRadius: 15,
              backgroundColor: "#000",
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onItemPress("rename", item)}
            >
              <View
                style={{width: '80%'}}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  color="#FFF"
                  style={styles.menuText}
                >
                  {item.name}
                </Text>
              </View>
              <SvgRename
                style={{
                  marginRight: 20,
                }}
              />
              <Text
                color="#FFF"
                fontFamily={fonts.azosans.light}
                style={styles.date}
              >
                {date2string(new Date(Date.parse(item?.timestamp)))}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: ScreenWidth * 3/5,
                height: 1,
                backgroundColor: "white",
                zIndex: 100,
              }}
            ></View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onItemPress("download", item)}
            >
              <Text color="#FFF" style={styles.menuText}>
                Download
              </Text>
              <SvgDownload style={{ marginRight: 20 }} />
            </TouchableOpacity>

            <View
              style={{
                width: ScreenWidth * 3/5,
                height: 1,
                backgroundColor: "white",
                zIndex: 100,
              }}
            ></View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onItemPress("delete", item)}
            >
              <Text color="#FFF" style={styles.menuText}>
                Delete
              </Text>
              <SvgDelete style={{ marginRight: 20 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    height: 56,
    flexDirection: "row",
    backdropFilter: "blur(2px)",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuText: {
    marginLeft: 20,
    color: "#FFF",
    fontFamily: "Azo Sans",
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "400",
  },

  date: {
    position: "absolute",
    bottom: 5,
    left: 20,
    color: "rgba(255, 255, 255, 0.2)",
    fontFamily: fonts.azosans.light,
    fontSize: 9,
    fontStyle: "normal",
  },
});

export default DropdownMenu;
