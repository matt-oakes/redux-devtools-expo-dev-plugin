declare global {
  const process: {
    env: {
      NODE_ENV: "development" | "production";
    };
  };
}

export let useReduxDevTools: typeof import("./useReduxDevTools").useReduxDevTools;

if (process.env.NODE_ENV !== "production") {
  useReduxDevTools = require("./useReduxDevTools").useReduxDevTools;
} else {
  useReduxDevTools = () => {};
}
