import { combineReducers } from "redux";

import vendorReducer from "./vendors/reducer";
import userReducer from './user/reducer'


export default combineReducers({
  vendorReducer,
  userReducer
});
