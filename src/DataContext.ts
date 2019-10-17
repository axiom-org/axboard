import React, { useContext } from "react";
import { AxiomObject, KeyPair } from "axiom-api";

import App from "./App";

type ObjectMap = { [id: string]: AxiomObject };
type CommentMap = { [parent: string]: ObjectMap };

type DataContextType = {
  app: App;
  postlist?: AxiomObject[];
  comments?: CommentMap;
  username?: string;
  keyPair?: KeyPair;
};

const DataContext = React.createContext<DataContextType | null>(null);

export default DataContext;

export function useDataContext(): DataContextType {
  let dc = useContext(DataContext);
  if (dc === null) {
    throw new Error("null context causes trouble");
  }
  return dc;
}
