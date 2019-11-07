import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
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
    <Nav>
      <NavDropdown title={"Logged in as " + data.username} id="logoutdropdown">
        <NavDropdown.Item as="button" onClick={() => data.app.logout()}>
          Log out
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

function Header(props: any) {
  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <LinkContainer to="/">
        <Navbar.Brand href="#home">Axboard</Navbar.Brand>
      </LinkContainer>
      {props.location.pathname !== "/login" && <LogInWidget />}
    </Navbar>
  );
}

export default withRouter(Header);
