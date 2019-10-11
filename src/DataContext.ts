import React from "react";
import { AxiomObject, KeyPair } from "axiom-api";

type ObjectMap = { [id: string]: AxiomObject };
type CommentMap = { [parent: string]: ObjectMap };

type DataContextType = {
  posts?: ObjectMap;
  comments?: CommentMap;
  keyPair?: KeyPair;
};

const EmptyDataContext: DataContextType = {};

const DataContext = React.createContext(emptyDataContext);

export default DataContext;
