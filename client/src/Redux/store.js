import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { reducer as Task } from "./task/task.reducer";

let rootReducer = combineReducers({
  Task,
});
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
