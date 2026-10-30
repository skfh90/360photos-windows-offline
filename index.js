/**
 * @format
 */

import { AppRegistry } from "react-native";
import AppNonSync from "./AppNonSync";
import AppSync from "./AppSync";
import { name as appName } from "./app.json";
import { SYNC_CONFIG } from "./sync.config";

export const App = () =>
  SYNC_CONFIG.enabled ? <AppSync appId={SYNC_CONFIG.appId} /> : <AppNonSync />;

AppRegistry.registerComponent(appName, () => App);
