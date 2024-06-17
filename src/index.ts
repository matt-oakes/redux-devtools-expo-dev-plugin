import { compose } from "@reduxjs/toolkit";

declare global {
  const process: {
    env: {
      NODE_ENV: "development" | "production";
    };
  };
}

export let composeWithDevTools: typeof import("./devtools").composeWithDevTools;
let devtoolsEnhancer: typeof import("./devtools").default;

if (process.env.NODE_ENV !== "production") {
  devtoolsEnhancer = require("./devtools").default;
  composeWithDevTools = require("./devtools").composeWithDevTools;
} else {
  devtoolsEnhancer = () => undefined;
  composeWithDevTools = compose;
}

export default devtoolsEnhancer;
