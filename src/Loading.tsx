import React from "react";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function Loading(props: { progress: number }) {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Title>Loading....</Card.Title>
        <ProgressBar striped animated now={props.progress * 100} />
      </Card.Body>
    </Card>
  );
}
