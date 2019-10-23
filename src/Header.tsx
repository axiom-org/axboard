import React from "react";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";

export default function Header() {
  let data = useDataContext();

  if (!data.keyPair) {
    return <Link to={"/login"}>log in</Link>;
  }
  return (
    <div>
      <p>logged in as {data.keyPair.getPublicKey()}</p>
      <div onClick={() => data.app.logout()}>log out</div>
    </div>
  );
}
