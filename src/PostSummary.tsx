import React, { useRef } from "react";
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

function VoteButton(props: {
  direction: number;
  currentVote: number;
  postID: string;
}) {
  let data = useDataContext();
  let button = useRef<any>(null);

  let style = props.direction < 0 ? { transform: "scaleY(-1)" } : {};

  return (
    <Button
      ref={button}
      variant="outline-secondary"
      active={props.direction * props.currentVote > 0}
      onClick={(e: any) => {
        e.preventDefault();
        button.current.blur();
        if (props.direction > 0) {
          data.app.upvote(props.postID);
        } else {
          data.app.downvote(props.postID);
        }
      }}
    >
      <ArrowUp width="20" height="20" style={style} />
    </Button>
  );
}

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
              <VoteButton
                direction={1}
                currentVote={currentVote}
                postID={props.post.id}
              />
              <Card.Text
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  textAlign: "center"
                }}
              >
                {data.votes.getScore(props.post.id)}
              </Card.Text>
              <VoteButton
                direction={-1}
                currentVote={currentVote}
                postID={props.post.id}
              />
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
