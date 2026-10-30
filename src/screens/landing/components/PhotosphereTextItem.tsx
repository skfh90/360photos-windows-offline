import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./PhotosphereTextItem.style";
// import { IPhotosphereTextItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IPhotosphereTextItemProps {
  style?: CustomStyleProp;
  //   data: IPhotosphereTextItem;
}

const PhotosphereTextItem: React.FC<IPhotosphereTextItemProps> = () => {
  //   const styles = useMemo(() => createStyles(theme), [theme]);

  //   const { name, description, language, star, fork } = data;

  return (
    <View style={{ paddingLeft: 25, paddingRight: 25, position: "relative" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 41,
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              borderRadius: 7,
              width: 113,
              height: 37,
              flexShrink: 0,
              backgroundColor:
                "linear-gradient(180deg, #59D07F 0%, #4DB671 100%)",
              position: "relative",
              marginBottom: 10,
              display: "none",
            }}
          >
            <Text
              color="#FFF"
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Azo Sans",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: "400",
              }}
            >
              TRY FREE
            </Text>
          </View>

          <Text
            color="#00130A"
            style={{
              fontFamily: "Azo Sans",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: 18,
              color: "#00130A",
            }}
          >
            My Photospheres
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PhotosphereTextItem;
