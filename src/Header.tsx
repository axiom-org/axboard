import React from "react";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";

function RightSide() {
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

export default function Header() {
  return (
    <div>
      <h1>
        <Link to="/">Axboard</Link>
      </h1>
      <RightSide />
    </div>
  );
}
