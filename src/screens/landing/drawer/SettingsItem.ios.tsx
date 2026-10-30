/* eslint-disable no-empty */
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
// import createStyles from "./SettingsItem.style";
// import { ISettingsItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import LinearGradient from "react-native-linear-gradient";
import ButSignUp from "../components/ButSignUp";
import useAuth from "../../../redux/guards/useAuth";
import SvgAccount from "../../../assets/menu/account.svg";
import SvgTutorial from "../../../assets/menu/tutorial.svg";
import SvgContactUs from "../../../assets/menu/contactus.svg";
import SvgRight from "../../../assets/menu/right.svg";
import fonts from "@fonts";
import { TouchableOpacity } from "react-native";
import Home from "./home";
import Account from "./account";
import Tutorial from "./tutorial";
import Contact from "./contact";
import PrivacyPolicy from "./privacypolicy";
import SvgLeft from "../../../assets/menu/left.svg";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISettingsItemProps {
  style?: CustomStyleProp;
  //   data: ISettingsItem;
  onPress: () => void;
  showDropdown?: (page: number) => void;
  showToast?: (text: string) => void;
  closeBottomDrawer?: () => void;
  setShowPrivacy: (status: boolean) => void;
}

const SettingsItem: React.FC<ISettingsItemProps> = ({
  style,
  onPress,
  showDropdown,
  showToast,
  closeBottomDrawer,
  setShowPrivacy,
}) => {
  const [page, setPage] = useState(0);

  return (
    <View
      style={{
        marginTop: 0,
      }}
    >
      {/* <TouchableOpacity
        style={{
          marginLeft: 10,
          marginTop: 10,
          padding: 10,
          width: 50,
          zIndex: 2000,
          position: "absolute",
          backgroundColor: "red",
        }}
        onPress={() => {
          console.log("backe pressed");
        }}
      >
        <SvgLeft />
      </TouchableOpacity> */}
      {page == 0 && <Home setPage={setPage} />}

      {page == 1 && (
        <Account
          setShowPrivacy={setShowPrivacy}
          setPage={setPage}
          showToast={showToast}
          closeBottomDrawer={closeBottomDrawer}
        />
      )}

      {page == 2 && <Tutorial setPage={setPage} />}

      {page == 3 && <Contact setPage={setPage} showToast={showToast} />}

      {page == 4 && <PrivacyPolicy setPage={setPage} />}
    </View>
  );
};

export default SettingsItem;
