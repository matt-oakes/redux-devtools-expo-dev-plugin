import { middlewares } from "@redux-devtools/app-core";
import localForage from "localforage";
import { createStore, compose, applyMiddleware } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import { api } from "../middlewares/api";
import { rootReducer } from "../reducers";

const persistConfig = {
  key: "redux-devtools",
  blacklist: ["instances", "socket"],
  storage: localForage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer) as any;

export default function configureStore() {
  let composeEnhancers = compose;
  if (process.env.NODE_ENV !== "production") {
    if (
      (
        window as unknown as {
          __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
        }
      ).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ) {
      composeEnhancers = (
        window as unknown as {
          __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
        }
      ).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  const store = createStore(
    persistedReducer,
    /// @ts-expect-error
    composeEnhancers(applyMiddleware(...middlewares, api)),
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
