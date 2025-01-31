/// <reference types="node" />
import { compose } from "redux";

export let createComposeWithDevTools: typeof import("./devtools").createComposeWithDevTools;
export let composeWithDevTools: ReturnType<typeof createComposeWithDevTools>;

let createDevToolsEnhancer: typeof import("./devtools").createDevToolsEnhancer;
let devtoolsEnhancer: ReturnType<typeof createDevToolsEnhancer>;

if (process.env.NODE_ENV !== "production") {
  const getDevToolsPluginClientAsync = require('expo/devtools').getDevToolsPluginClientAsync;
  const createDevToolsEnhancer = require("./devtools").createDevToolsEnhancer;

  devtoolsEnhancer = createDevToolsEnhancer(() => getDevToolsPluginClientAsync("redux-devtools-expo-dev-plugin"));
  createComposeWithDevTools = require("./devtools").createComposeWithDevTools;
  composeWithDevTools = createComposeWithDevTools(() => getDevToolsPluginClientAsync("redux-devtools-expo-dev-plugin"));
} else {
  devtoolsEnhancer = () => (next) => next;
  createComposeWithDevTools = () => compose;
  composeWithDevTools = compose;
}

export default devtoolsEnhancer;
