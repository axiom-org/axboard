import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

import FancyText from "./FancyText";

let text = `
TODO: write a bunch of stuff here
`;

export default function About() {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Title>About Axboard</Card.Title>
        <FancyText text={text} />
        <LinkContainer to="/">
          <Card.Link>Return to the home page.</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
