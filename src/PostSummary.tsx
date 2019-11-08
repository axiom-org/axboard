import React from "react";
import { AxiomObject } from "axiom-api";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { useDataContext } from "./DataContext";
import UserReference from "./UserReference";
import { ago } from "./Util";
import { ReactComponent as ArrowUp } from "./arrow-up.svg";

export default function PostSummary(props: { post: AxiomObject }) {
  let data = useDataContext();
  let comments = data.comments[props.post.id];
  let numComments = comments ? Object.keys(comments).length : 0;
  let commentsPhrase = `${numComments} comment${numComments === 1 ? "" : "s"}`;

  let board = data.boards[props.post.data.board];

  let currentVote = 0;
  if (data.keyPair) {
    let pk = data.keyPair.getPublicKey();
    if (pk === props.post.owner) {
      currentVote = 1;
    } else {
      let vote = data.votes.getVote(pk, props.post.id);
      if (vote) {
        currentVote = vote.data.score;
      }
    }
  }

  return (
    <Card style={{ marginTop: "10px" }}>
      <Container>
        <Row>
          <Col xs="auto">
            <Card.Body>
              <Button
                variant="outline-secondary"
                active={currentVote > 0}
                onClick={() => {
                  data.app.upvote(props.post.id);
                }}
              >
                <ArrowUp width="20" height="20" />
              </Button>
              <Card.Text
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  textAlign: "center"
                }}
              >
                {data.votes.getScore(props.post.id)}
              </Card.Text>
              <Button
                variant="outline-secondary"
                active={currentVote < 0}
                onClick={() => {
                  data.app.downvote(props.post.id);
                }}
              >
                <ArrowUp
                  width="20"
                  height="20"
                  style={{ transform: "scaleY(-1)" }}
                />
              </Button>
            </Card.Body>
          </Col>
          <Col>
            <Card.Body>
              <Card.Title>{props.post.data.content}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                posted by{" "}
                <UserReference
                  username={props.post.data.author}
                  publicKey={props.post.owner}
                />{" "}
                {ago(props.post.timestamp)}
                {board && [
                  <span key={1}> in </span>,
                  <Link key={2} to={`/b/${board.name}/${board.id}`}>{`b/${
                    board.name
                  }`}</Link>
                ]}
              </Card.Subtitle>
              <Card.Text>
                <Link to={`/post/${props.post.id}`}>{commentsPhrase}</Link>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
