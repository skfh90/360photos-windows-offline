/* eslint-disable no-empty */
import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
/**
 * ? Local Imports
 */
// import createStyles from "./SigninItem.style";
// import { ISigninItem } from "@services/models";

import Text from "@shared-components/text-wrapper/TextWrapper";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import SvgAccount from "../../../assets/menu/account.svg";
import SvgTutorial from "../../../assets/menu/tutorial.svg";
import SvgContactUs from "../../../assets/menu/contactus.svg";
import SvgPrivacyPolicy from "../../../assets/menu/privacypolicy.svg";
import SvgRight from "../../../assets/menu/right.svg";
import fonts from "@fonts";

interface IHomeProps {
  setPage: (page: number) => void;
}

const Home: React.FC<IHomeProps> = ({ setPage }) => {
  return (
    <View
      style={{
        width: ScreenWidth,
      }}
    >
      <View
        style={{
          ...styles.borderTop,
          marginTop: Platform.OS == "android" ? 40 : 0,
        }}
      />
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        onPress={() => setPage(1)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 25,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#D9D9D9",
            }}
          >
            <SvgAccount />
          </View>

          <Text
            fontFamily={fonts.azosans.medium}
            style={{
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            {" "}
            Account{" "}
          </Text>
        </View>
        <SvgRight
          style={{
            marginRight: 25,
          }}
        />
      </TouchableOpacity>
      <View style={styles.borderTop} />
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        onPress={() => setPage(2)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 25,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#D9D9D9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgTutorial />
          </View>
          <Text
            fontFamily={fonts.azosans.medium}
            style={{
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            {" "}
            Tutorial{" "}
          </Text>
        </View>
        <SvgRight
          style={{
            marginRight: 25,
          }}
        />
      </TouchableOpacity>
      <View style={styles.borderTop} />
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        onPress={() => setPage(3)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 25,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#D9D9D9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgContactUs
              style={{
                marginTop: 2,
              }}
            />
          </View>
          <Text
            fontFamily={fonts.azosans.medium}
            style={{
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            {" "}
            Contact Us{" "}
          </Text>
        </View>
        <SvgRight
          style={{
            marginRight: 25,
          }}
        />
      </TouchableOpacity>
      <View style={styles.borderTop} />

      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        onPress={() => setPage(4)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 25,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#D9D9D9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgPrivacyPolicy
              style={{
                marginTop: 2,
              }}
            />
          </View>
          <Text
            fontFamily={fonts.azosans.medium}
            style={{
              marginLeft: 10,
              fontSize: 16,
            }}
          >
            {" "}
            Privacy Policy{" "}
          </Text>
        </View>
        <SvgRight
          style={{
            marginRight: 25,
          }}
        />
      </TouchableOpacity>
      <View style={styles.borderTop} />
    </View>
  );
};

const styles = StyleSheet.create({
  borderTop: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 19, 10, 0.20)",
  },
});

export default Home;
