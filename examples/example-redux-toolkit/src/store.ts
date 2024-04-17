import { createStore, createSlice, combineSlices } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0
  },
  reducers: {
    up: (state) => {
      state.count += 1;
    },
    down: (state) => {
      state.count -= 1;
    },
  },
});

const reducers = combineSlices(counterSlice);

export const store = createStore(reducers, devToolsEnhancer());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
