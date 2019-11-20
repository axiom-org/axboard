import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

export default function ErrorPage(props: { text: string }) {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Title>Error</Card.Title>
        <Card.Text>{props.text}</Card.Text>
        <LinkContainer to="/">
          <Card.Link>Return to the home page.</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
