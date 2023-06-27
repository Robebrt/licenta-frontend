import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import viewsReducer from "./viewsReducer.js";
import commentsReducer from "./commentsReducer.js";

export default combineReducers({
  user: authReducer,
  views: viewsReducer,
  comments: commentsReducer,
});
