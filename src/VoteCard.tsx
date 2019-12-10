import React, { useRef } from "react";
import { AxiomObject } from "axiom-api";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { ReactComponent as ArrowUp } from "./arrow-up.svg";
import { useDataContext } from "./DataContext";

function VoteButton(props: {
  direction: number;
  currentVote: number;
  target: string;
}) {
  let data = useDataContext();
  let button = useRef<any>(null);

  let style = props.direction < 0 ? { transform: "scaleY(-1)" } : {};
  let active = props.direction * props.currentVote > 0;

  return (
    <Button
      ref={button}
      variant="outline-secondary"
      active={active}
      onClick={(e: any) => {
        e.preventDefault();
        button.current.blur();
        if (!data.keyPair) {
          window.location.assign("/#/login");
          return;
        }
        if (active) {
          data.app.unvote(props.target);
        } else if (props.direction > 0) {
          data.app.upvote(props.target);
        } else {
          data.app.downvote(props.target);
        }
      }}
    >
      <ArrowUp width="20" height="20" style={style} />
    </Button>
  );
}

export default function VoteCard(props: {
  target: AxiomObject;
  children: any;
}) {
  let data = useDataContext();
  let currentVote = 0;

  if (data.keyPair) {
    let pk = data.keyPair.getPublicKey();
    if (pk === props.target.owner) {
      currentVote = 1;
    } else {
      let vote = data.votes.getVote(pk, props.target.id);
      if (vote) {
        currentVote = vote.data.score;
      }
    }
  }

  let score = data.votes.getVoteCount(props.target.id);

  return (
    <Card style={{ marginTop: "10px" }}>
      <Container>
        <Row>
          <Col xs="auto">
            <Card.Body>
              <VoteButton
                direction={1}
                currentVote={currentVote}
                target={props.target.id}
              />
              <Card.Text
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  textAlign: "center"
                }}
              >
                {score}
              </Card.Text>
              <VoteButton
                direction={-1}
                currentVote={currentVote}
                target={props.target.id}
              />
            </Card.Body>
          </Col>
          <Col>
            <Card.Body>{props.children}</Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
