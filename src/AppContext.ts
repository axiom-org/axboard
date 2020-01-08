import React, { useContext } from "react";

import App from "./App";

const AppContext = React.createContext<App | null>(null);

export default AppContext;

export function useAppContext(): App {
  let ac = useContext(AppContext);
  if (ac === null) {
    throw new Error("cannot use null app context");
  }
  return ac;
}
