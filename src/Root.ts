import App from "./App";

let appWrapper: { app?: App } = {app: undefined};

// A wrapper to access the single, global App variable.
export default function Root(): App {
  if (!appWrapper.app) {
    throw new Error("setRoot was never called");
  }
  return appWrapper.app;
}

export function setRoot(app: App) {
  appWrapper.app = app;
}
