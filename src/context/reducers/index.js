import { combineReducers } from "redux";
import userAuthReducer from "./userAuthReducers";
import projectReducer from "./ProjectReducer";
import searchReducer from "./SearchReducer";
const myReducer = combineReducers({
  user: userAuthReducer,
  projects: projectReducer,
  searchTerm: searchReducer,
});

export default myReducer;
