/* eslint-disable no-empty */
import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Home from "./home";
import Account from "./account";
import Tutorial from "./tutorial";
import Contact from "./contact";
import PrivacyPolicy from "./privacypolicy";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISigninItemProps {
  style?: CustomStyleProp;
  //   data: ISigninItem;
  onPress: () => void;
  showDropdown?: (page: number) => void;
  showToast?: (text: string) => void;
  closeBottomDrawer?: () => void;
  setShowPrivacy: (status: boolean) => void;
}

const SigninItem: React.FC<ISigninItemProps> = ({
  showToast,
  closeBottomDrawer,
  setShowPrivacy,
}) => {
  const [page, setPage] = useState(0);

  return (
    <View
      style={{
        marginTop: -100,
      }}
    >
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

export default SigninItem;
