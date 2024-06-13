/// <reference types="node" />
import { compose } from "redux";

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
