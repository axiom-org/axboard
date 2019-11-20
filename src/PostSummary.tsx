import React, { useRef } from "react";
import { AxiomObject } from "axiom-api";
import { LinkContainer } from "react-router-bootstrap";
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

function CardTitle(props: { post: AxiomObject }) {
  let style = { color: "black" };
  if (props.post.data.url) {
    return (
      <Card.Title>
        <a style={style} href={props.post.data.url}>
          {props.post.data.title}
        </a>
      </Card.Title>
    );
  }
  return (
    <Card.Title>
      <Link style={style} to={`/post/${props.post.id}`}>
        {props.post.data.title}
      </Link>
    </Card.Title>
  );
}

function VoteCard(props: {
  currentVote: number;
  target: string;
  children: any;
}) {
  let data = useDataContext();
  return (
    <Card style={{ marginTop: "10px" }}>
      <Container>
        <Row>
          <Col xs="auto">
            <Card.Body>
              <VoteButton
                direction={1}
                currentVote={props.currentVote}
                target={props.target}
              />
              <Card.Text
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  textAlign: "center"
                }}
              >
                {data.votes.getScore(props.target)}
              </Card.Text>
              <VoteButton
                direction={-1}
                currentVote={props.currentVote}
                target={props.target}
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

export default function PostSummary(props: {
  post: AxiomObject;
  linkToComments: boolean;
}) {
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
                target={props.post.id}
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
                target={props.post.id}
              />
            </Card.Body>
          </Col>
          <Col>
            <Card.Body>
              <CardTitle post={props.post} />
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
              <Card.Text>{props.post.data.summary}</Card.Text>
              {props.linkToComments && (
                <LinkContainer to={`/post/${props.post.id}`}>
                  <Card.Link>{commentsPhrase}</Card.Link>
                </LinkContainer>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}
