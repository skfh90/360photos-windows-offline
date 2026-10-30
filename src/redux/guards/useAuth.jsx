import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

// redux
import {
  login,
  register,
  resetPassword,
  logout,
  profileUpdate,
  postLogin,
} from "../slices/authJwt";

// ----------------------------------------------------------------------

useAuth.propTypes = {
  method: PropTypes.oneOf(["jwt", "firebase"]),
};

export default function useAuth(method = "jwt") {
  // JWT Auth
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated, is2FAPassed } = useSelector(
    (state) => state.authJwt,
  );

  return {
    method: "jwt",
    user,
    isLoading,
    is2FAPassed,
    isAuthenticated,

    login: ({ email, password }) =>
      dispatch(
        login({
          email,
          password,
        }),
      ),
    postLogin: ({ accessToken, user }) =>
      dispatch(
        postLogin({
          accessToken,
          user,
        }),
      ),
    register: ({ response }) => {
      dispatch(
        register({
          response,
        }),
      );
    },

    logout: () => dispatch(logout()),

    resetPassword: ({ email, newPassword }) =>
      dispatch(
        resetPassword({
          email,
          newPassword,
        }),
      ),

    profileUpdate: ({ fullName, email, id }) => {
      dispatch(
        profileUpdate({
          fullName,
          email,
          id,
        }),
      );
    },
  };
}
