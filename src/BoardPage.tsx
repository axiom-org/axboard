import React from "react";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function BoardPage(props: { id: string; name: string }) {
  let data = useDataContext();

  return <div>TODO</div>;
}
