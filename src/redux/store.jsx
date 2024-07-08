import { userReducer } from "./reducer/userReducer"
import { createStore } from "redux";
import { combineReducers } from "redux";
import { reportsReducer } from "./reducer/reportsReducer";
import { activityLogReducer } from "./reducer/activityLogReducer";
import { itemReducer } from "./reducer/itemReducer";

export const reducer=combineReducers({userReducer,reportsReducer,activityLogReducer,itemReducer})



// export const reducer = combineReducers({
//     user: userReducer,
//     reports: reportsReducer,
//     activityLog: activityLogReducer
// });

export const store = createStore(reducer);
window.store = store;