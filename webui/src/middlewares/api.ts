import {
  DispatchAction,
  getActiveInstance,
  LIFTED_ACTION,
  LiftedActionAction,
  REMOVE_INSTANCE,
  Request,
  showNotification,
  UPDATE_REPORTS,
  UPDATE_STATE,
  UpdateReportsRequest,
} from "@redux-devtools/app-core";
import {
  DevToolsPluginClient,
  getDevToolsPluginClientAsync,
} from "expo/devtools";
import { stringify } from "jsan";
import { Dispatch, MiddlewareAPI } from "redux";

import { EmitAction, StoreAction } from "../actions";
import * as actions from "../constants/socketActionTypes";
import { StoreState } from "../reducers";
import { nonReduxDispatch } from "../utils/monitorActions";

let devToolsPluginClient: DevToolsPluginClient | undefined;
let store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>;

function emit({ message: type, instanceId, action, state }: EmitAction) {
  devToolsPluginClient?.sendMessage("respond", {
    type,
    action,
    state,
    instanceId,
  });
}

function dispatchRemoteAction({
  message,
  action,
  state,
  toAll,
}: LiftedActionAction) {
  const instances = store.getState().instances;
  const instanceId = getActiveInstance(instances);
  const id = !toAll && instances.options[instanceId].connectionId;
  store.dispatch({
    type: actions.EMIT,
    message,
    action,
    state: nonReduxDispatch(
      store,
      message,
      instanceId,
      action as DispatchAction,
      state,
      instances,
    ),
    instanceId,
    id,
  });
}

interface RequestBase {
  id?: string;
  instanceId?: string;
}
interface DisconnectedAction extends RequestBase {
  type: "DISCONNECTED";
  id: string;
}
interface StartAction extends RequestBase {
  type: "START";
  id: string;
}
interface ErrorAction extends RequestBase {
  type: "ERROR";
  payload: string;
}
interface RequestWithData extends RequestBase {
  data: Request;
}
type MonitoringRequest =
  | DisconnectedAction
  | StartAction
  | ErrorAction
  | Request;

function monitoring(request: MonitoringRequest) {
  if (request.type === "DISCONNECTED") {
    store.dispatch({
      type: REMOVE_INSTANCE,
      id: request.id,
    });
    return;
  }
  if (request.type === "START") {
    store.dispatch({ type: actions.EMIT, message: "START", id: request.id });
    return;
  }

  if (request.type === "ERROR") {
    store.dispatch(showNotification(request.payload));
    return;
  }

  store.dispatch({
    type: UPDATE_STATE,
    request: (request as unknown as RequestWithData).data
      ? { ...(request as unknown as RequestWithData).data, id: request.id }
      : request,
  });

  const instances = store.getState().instances;
  const instanceId = request.instanceId || request.id;
  if (
    instances.sync &&
    instanceId === instances.selected &&
    (request.type === "ACTION" || request.type === "STATE")
  ) {
    devToolsPluginClient?.sendMessage("respond", {
      type: "SYNC",
      state: stringify(instances.states[instanceId]),
      id: request.id,
      instanceId,
    });
  }
}

async function connect() {
  if (process.env.NODE_ENV === "test") return;
  try {
    devToolsPluginClient = await getDevToolsPluginClientAsync(
      "redux-devtools-expo-dev-plugin",
    );

    const watcher = (request: UpdateReportsRequest) => {
      store.dispatch({ type: UPDATE_REPORTS, request });
    };
    devToolsPluginClient.addMessageListener("log", (data) => {
      monitoring(data as MonitoringRequest);
      watcher(data as UpdateReportsRequest);
    });

    store.dispatch({ type: actions.EMIT, message: "START" });
  } catch (error) {
    // TODO: Handle errors better?
    console.warn(
      "redux-devtools-expo-dev-plugin: Error while connecting to Expo dev tools client " +
        error,
    );
  }
}

export function api(inStore: MiddlewareAPI<Dispatch<StoreAction>, StoreState>) {
  store = inStore;
  connect();

  return (next: Dispatch<StoreAction>) => (action: StoreAction) => {
    const result = next(action);
    switch (action.type) {
      case actions.EMIT:
        if (devToolsPluginClient) emit(action);
        break;
      case LIFTED_ACTION:
        dispatchRemoteAction(action);
        break;
    }
    return result;
  };
}
