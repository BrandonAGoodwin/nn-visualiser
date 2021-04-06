import { combineReducers, createStore } from "redux";
import { networkReducer } from "../NetworkReducer";

export const rootReducer = combineReducers({ networkReducer });

export type AppState = ReturnType<typeof rootReducer>;
// export type AppState = ReturnType<typeof networkReducer>;

export let store = createStore(rootReducer);
// export let store = createStore(networkReducer);

