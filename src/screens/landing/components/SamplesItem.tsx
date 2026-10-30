import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./SamplesItem.style";
// import { ISamplesItem } from "@services/models";

import PhotosphereItem from "./PhotosphereItem";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISamplesItemProps {
  style?: CustomStyleProp;
}

const SamplesItem: React.FC<ISamplesItemProps> = () => {
  //   const styles = useMemo(() => createStyles(theme), [theme]);

  //   const { name, description, language, star, fork } = data;

  return (
    <View style={{ flexDirection: "row" }}>
      <PhotosphereItem
        localName="Sunset at Lake"
        source={require("../../../assets/landing/ext-thumbnail.jpg")}
      />
      <View
        style={{
          width: 9,
        }}
      ></View>
      <PhotosphereItem
        localName="Vacation Foyer"
        source="../../../assets/landing/int-thumbnail.jpg"
      />
    </View>
  );
};

export default SamplesItem;
