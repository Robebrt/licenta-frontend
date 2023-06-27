import axios from "axios";
import { LOGIN_REQUEST } from "../actions/authTypes";
import { loginSuccess, loginFailure } from "../actions/authActions";
import Cookies from "js-cookie";

const authMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      const { email, password } = action.payload;
      // Simulare de cerere către server pentru autentificare
      axios
        .post("http://localhost:3000/api/login", { email, password })
        .then((response) => {
          // Simulare de răspuns de la server cu token de autentificare
          const { user, token } = response.data;
          Cookies.set("token", token);
          store.dispatch(loginSuccess(user, token));
        })
        .catch((error) => {
          store.dispatch(loginFailure(error.response.data.error));
        });
    }
  }
  return next(action);
};

export default authMiddleware;
