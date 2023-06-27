import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import authMiddleware from "./middleware/authMiddleware";

const store = createStore(reducer, applyMiddleware(thunk, authMiddleware));

export default store;
