import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import authJwtReducer from "./slices/authJwt";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  keyPrefix: "redux-",
  whitelist: ["settings"],
};

const authPersistConfig = {
  key: "authJwt",
  storage: AsyncStorage,
  keyPrefix: "redux-",
  whitelist: ["isAuthenticated"],
};

const rootReducer = combineReducers({
  authJwt: persistReducer(authPersistConfig, authJwtReducer),
});

export { rootPersistConfig, rootReducer };
