import jwtDecode from "jwt-decode";
import { createSlice } from "@reduxjs/toolkit";
// utils
// import axios from '../../utils/axios';
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData, removeData, storeData } from "../../shared/utils";
// ----------------------------------------------------------------------

import { API_URL, getAccessToken } from "../../shared/constants";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  is2FAPassed: false,
  user: {},
};

const slice = createSlice({
  name: "authJwt",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // INITIALISE
    getInitialize(state, action) {
      state.isLoading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      const is2FA = true;
      if (is2FA && state.isAuthenticated) {
        state.is2FAPassed = is2FA;
      } else {
        state.is2FAPassed = false;
      }
    },

    // LOGIN
    loginSuccess(state, action) {
      console.log("dispatch loginSuccess");
      console.log(state);
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // REGISTER
    registerSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // UPDATE
    profileUpdateSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // LOGOUT
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.is2FAPassed = false;
    },

    // 2FA
    handle2FASuccess(state) {
      state.is2FAPassed = true;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = async (accessToken) => {
  if (accessToken) {
    await storeData("accessToken", accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    await removeData("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

// ----------------------------------------------------------------------

export function login({ email, password }) {
  return async (dispatch) => {
    const rawResponse = await fetch(`${API_URL}/setup/signin/email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const response = await rawResponse.json();
    if (response.type != "success") {
      throw response;
    }

    const accessToken = response.token;
    await setSession(accessToken);

    const user = {
      id: response.user.id,
      fullName: response.user.full_name,
      email: response.user.email,
      role: response.user.role,
      credit: response.user.credit,
    };

    dispatch(slice.actions.loginSuccess({ user }));
  };
}

export function postLogin({ accessToken, user }) {
  return async (dispatch) => {
    await setSession(accessToken);

    const newUser = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      credit: user.credit,
    };

    dispatch(slice.actions.loginSuccess({ user: newUser }));
  };
}
// ----------------------------------------------------------------------

export function register({ response }) {
  return async (dispatch) => {
    const accessToken = response.data.token;
    setSession(accessToken);

    const user = {
      id: response.data.user.id,
      fullName: response.data.user.full_name,
      nick_name: response.data.user.nick_name,
      email: response.data.user.email,
      walletAddress: response.data.user.walletAddress,
      role: response.data.user.role,
      photoURL: `${API_URL}/` + response.data.user.avartar,
      country: response.data.user.country,
      inneraddress: response.data.user.innerwalletaddress,
      innerprivatekey: response.data.user.innerprivatekey,
      twoFAEmail: response.data.user.twoFAEmail,
    };
    dispatch(slice.actions.loginSuccess({ user }));
  };
}

export function resetPassword({ email, newPassword }) {
  return async (dispatch) => {
    const response = await axios.post(`${API_URL}/setup/forgotpassword`, {
      email: email,
      newPassword: newPassword,
    });
    const accessToken = response.data.token;
    setSession(accessToken);

    const user = {
      id: response.data.user.id,
      fullName: response.data.user.full_name,
      nick_name: response.data.user.nick_name,
      email: response.data.user.email,
      walletAddress: response.data.user.walletAddress,
      role: response.data.user.role,
      photoURL: `${API_URL}/` + response.data.user.avartar,
      country: response.data.user.country,
      inneraddress: response.data.user.innerwalletaddress,
      innerprivatekey: response.data.user.innerprivatekey,
      twoFAEmail: response.data.user.twoFAEmail,
    };

    dispatch(slice.actions.loginSuccess({ user }));
  };
}

// ----------------------------------------------------------------------

export function profileUpdate({ fullName, email, id }) {
  return async (dispatch) => {
    const accessToken = await getData("accessToken");
    const response = await axios.post(
      `${API_URL}/setup/updateprofile`,
      {
        fullName,
        email,
        id,
      },
      {
        headers: { Authorization: accessToken },
        timeout: 2000,
      },
    );

    if (response.data.type != "success") {
      throw response;
    }

    setSession(response.data.token);

    const user = {
      id: response.data.user.id,
      fullName: response.data.user.full_name,
      email: response.data.user.email,
      role: response.data.user.role,
      credit: response.data.user.credit,
    };

    dispatch(slice.actions.profileUpdateSuccess({ user: user }));
  };
}

// ----------------------------------------------------------------------

export function logout() {
  return async (dispatch) => {
    setSession(null);
    dispatch(slice.actions.logoutSuccess());
    await removeData("handle2FA");
  };
}

// ----------------------------------------------------------------------

export function handle2FA() {
  return async (dispatch) => {
    dispatch(slice.actions.handle2FASuccess());
    await storeData("handle2FA", true);
  };
}
// ----------------------------------------------------------------------

export function getInitialize() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = await getData("accessToken");
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // const response = await axios.get('/api/account/my-account');
        const decoded = jwtDecode(accessToken);
        const user = {
          id: decoded.sub.id,
          fullName: decoded.sub.full_name,
          nickName: decoded.sub.nick_name,
          email: decoded.sub.email,
          walletAddress: decoded.sub.walletAddress,
          role: decoded.sub.role,
          photoURL: `${API_URL}/` + decoded.sub.avartar,
          country: decoded.sub.country,
          inneraddress: decoded.sub.innerwalletaddress,
          innerprivatekey: decoded.sub.innerprivatekey,
          twoFAEmail: decoded.sub.twoFAEmail,
        };

        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: true,
            user: user,
          }),
        );
      } else {
        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: false,
            user: null,
          }),
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null,
        }),
      );
    }
  };
}
