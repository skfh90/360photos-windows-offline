import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import { getData } from "../utils";

// ? Screens
export const SCREENS = {
  HOME: "Home",
  SEARCH: "Search",
  NOTIFICATION: "Notification",
  PROFILE: "Profile",
  DETAIL: "Detail",
  Capture: "Capture",
  LANDING: "Landing",
  GUIDE: "Guide",
  Test: "Test",
  SPLASH: "Splash",
  VIEWER: "Viewer",
};

export const BOTTOM_DRAWER_HEIGHT =
  ScreenHeight < 800 ? (ScreenHeight * 7) / 8 : ScreenHeight - 135;

export const API_URL = "https://360app.dospace.tech";
export const IMAGE_URL = "https://dospace.s3.us-east-2.amazonaws.com";

let accessToken = "";
getData("accessToken")
  .then((value) => (accessToken = value))
  .catch(() => (accessToken = ""));

export const getAccessToken = () => {
  return accessToken;
};
// export const API_URL = "http://localhost:3002";
export const ratioWidth = ScreenWidth / 375;
export const ratioHeight = ScreenHeight / 667;
