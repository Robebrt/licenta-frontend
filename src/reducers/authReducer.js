import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_USER_DATA,
} from "../actions/authTypes";

const initialState = {
  user: {},
  token: "",
  error: "",
  isLoading: false,
  isAuthenticated: false,
  email: "",
  password: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        email: action.payload.email,
        password: action.payload.password,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        error: "",
        isLoading: false,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        error: "",
        isAuthenticated: false,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

export default authReducer;
