import React from "react";
import { View, StyleProp, ViewStyle, Image } from "react-native";
import { useTheme } from "@react-navigation/native";

/**
 * ? Local Imports
 */
// import createStyles from "./LoadingItem.style";
// import { ILoadingItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
interface ILoadingItemProps {
  item: any;
}

const LoadingItem: React.FC<ILoadingItemProps> = ({ item }) => {
  const theme = useTheme();
  const { colors } = theme;
  //   const styles = useMemo(() => createStyles(theme), [theme]);

  //   const { name, description, language, star, fork } = data;

  return (
    <View
      style={{
        width: (ScreenWidth - 30) / 2,
        height: (ScreenWidth - 30) / 4,
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
        position: "relative",
      }}
    >
      <Image
        source={require("../../../assets/landing/mask.png")}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 7,
        }}
      />
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 40, height: 40 }}
          source={require("../../../assets/landing/360-Loader-400px.gif")}
        />
      </View>

      {/* <GifImage
        source={{
          uri: "../../../assets/landing/360-Loader-400px.gif",
        }}
        style={{
          width: 40,
          height: 40,
        }}
      /> */}

      {/* <Image
        style={{
          width: 40,
          height: 40,
        }}
        source={require("../../../assets/landing/360-Loader-400px.gif")}
      /> */}

      {/* <Text
        color="#FFFFFF"
        style={{
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: 13,
          lineHeight: 16,
          color: "#FFFFFF",
          textShadowColor: "rgba(0, 0, 0, 0.25)",
          textShadowOffset: { width: 0, height: 4 },
          textShadowRadius: 4,
          position: "absolute",
          bottom: 2,
          left: 12,
        }}
      >
        {item.name}
      </Text> */}
    </View>
  );
};

export default LoadingItem;
