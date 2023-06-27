import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_USER_DATA,
} from "./authTypes.js";
import Cookies from "js-cookie";

// Acțiunea de autentificare cu cererea de logare către server
export const loginRequest = (email, password) => {
  return {
    type: LOGIN_REQUEST,
    payload: {
      email: email,
      password: password,
    },
  };
};

// Acțiunea de actualizare a user-ului
export const updateUserData = (user) => {
  return {
    type: UPDATE_USER_DATA,
    payload: {
      user,
    },
  };
};
// Acțiunea de succes pentru autentificare
export const loginSuccess = (user, token) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      user,
      token,
    },
  };
};

// Acțiunea de eroare pentru autentificare
export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: {
      error,
    },
  };
};

// Acțiunea de delogare
export const logout = () => {
  return (dispatch) => {
    Cookies.remove("token");
    dispatch({
      type: LOGOUT,
    });
  };
};
