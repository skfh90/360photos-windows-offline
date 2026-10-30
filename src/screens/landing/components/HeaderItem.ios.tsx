import React, { useEffect } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./HeaderItem.style";
// import { IHeaderItem } from "@services/models";

import SvgPhoto360 from "../../../assets/landing/Photo360.svg";
import SvgMenu from "../../../assets/landing/menu.svg";
import SvgHeader from "../../../assets/landing/header.svg";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { getData, storeData } from "../../../shared/utils";
import { useSelector, useDispatch } from "react-redux";
import fonts from "@fonts";
import LinearGradient from "react-native-linear-gradient";
import { getInitialize } from "redux/slices/authJwt";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IHeaderItemProps {
  style?: CustomStyleProp;
  //   data: IHeaderItem;
  onPress: () => void;
  showDropdown: (page: number) => void;
}

const HeaderItem: React.FC<IHeaderItemProps> = ({ onPress, showDropdown }) => {
  //   const styles = useMemo(() => createStyles(theme), [theme]);

  //   const { name, description, language, star, fork } = data;
  const { isAuthenticated, user } = useSelector((state: any) => state.authJwt);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInitialize() as any);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      storeData("hadCredential", "yes");
    }
  }, [isAuthenticated]);

  return (
    <LinearGradient
      locations={[0, 1]}
      colors={["#183221", "#000000"]}
      useAngle={true}
      angle={180}
      style={{
        // paddingTop: 35,
        // paddingBottom: 15,
        position: "absolute",
        top: 0,
        width: "100%",
        height: 140,
        // marginTop: -statusBarHeight,
      }}
    >
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onPress} />
      {isAuthenticated && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 35,
            marginLeft: 30,
            marginRight: 30,
          }}
        >
          <Text color="#59D07F">Hi, {user?.fullName}</Text>
          <TouchableOpacity
            onPress={() => {
              showDropdown(3);
            }}
          >
            <SvgMenu
              onPress={() => {
                showDropdown(3);
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      {!isAuthenticated && (
        <TouchableOpacity
          style={{
            marginTop: 35,
            marginRight: 30,
            alignSelf: "flex-end",
          }}
          onPress={async () => {
            const hadCredential = await getData("hadCredential");
            if (hadCredential == "yes") showDropdown(1);
            else showDropdown(2);
          }}
        >
          <Text
            color="#59D07F"
            style={{
              fontFamily: "Azo Sans",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: "400",
              letterSpacing: 1.6,
            }}
          >
            LOG IN
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={{
          marginTop: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SvgHeader />
      </View>
    </LinearGradient>
  );
};

export default HeaderItem;
