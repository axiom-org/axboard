import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
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
    <Navbar bg="dark" variant="dark">
      <LinkContainer to="/">
        <Navbar.Brand href="#home">Axboard</Navbar.Brand>
      </LinkContainer>
      <RightSide />
    </Navbar>
  );
}
