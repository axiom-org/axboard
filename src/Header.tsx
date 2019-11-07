import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { Link, withRouter } from "react-router-dom";

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

function Header(props: any) {
  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <LinkContainer to="/">
        <Navbar.Brand href="#home">Axboard</Navbar.Brand>
      </LinkContainer>
      {props.location.pathname !== "/login" && (
        <LogInWidget pathname={props.location.pathname} />
      )}
    </Navbar>
  );
}

export default withRouter(Header);
