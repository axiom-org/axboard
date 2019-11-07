import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";

function LogInWidget() {
  let data = useDataContext();

  if (!data.keyPair) {
    return (
      <Nav>
        <LinkContainer to="/login">
          <Button active={false}>log in</Button>
        </LinkContainer>
      </Nav>
    );
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
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <LinkContainer to="/">
        <Navbar.Brand href="#home">Axboard</Navbar.Brand>
      </LinkContainer>
      <LogInWidget />
    </Navbar>
  );
}
