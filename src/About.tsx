import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

export default function About() {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Title>About Axboard</Card.Title>
        <Card.Text>{"TODO: write a bunch of stuff about Axboard"}</Card.Text>
        <LinkContainer to="/">
          <Card.Link>Return to the home page.</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
