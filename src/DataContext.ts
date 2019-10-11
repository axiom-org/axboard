import React from "react";
import { AxiomObject, KeyPair } from "axiom-api";

import App from "./App";

type ObjectMap = { [id: string]: AxiomObject };
type CommentMap = { [parent: string]: ObjectMap };

type DataContextType = {
  app?: App;
  posts?: AxiomObject[];
  comments?: CommentMap;
  keyPair?: KeyPair;
};

const DataContext = React.createContext<DataContextType>({});

export default DataContext;
