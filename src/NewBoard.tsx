import React from "react";

import { useDataContext } from "./DataContext";

export default function NewBoard() {
  let data = useDataContext();
  if (!data.username) {
    return <div>You must log in to create a new board.</div>;
  }

  return <div>TODO</div>;
}
