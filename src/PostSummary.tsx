import React from "react";
import { AxiomObject } from "axiom-api";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

import BoardReference from "./BoardReference";
import CensorLink from "./CensorLink";
import { useDataContext } from "./DataContext";
import FancyText from "./FancyText";
import UserReference from "./UserReference";
import { ago } from "./Util";
import VoteCard from "./VoteCard";

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

export default function PostSummary(props: {
  post: AxiomObject;
  linkToComments: boolean;
}) {
  let data = useDataContext();
  let comments = data.comments[props.post.id];
  let numComments = comments ? Object.keys(comments).length : 0;
  let commentsPhrase = `${numComments} comment${numComments === 1 ? "" : "s"}`;

  let board = data.boards[props.post.data.board];

  return (
    <VoteCard target={props.post}>
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
          <BoardReference key={2} board={board} />
        ]}
      </Card.Subtitle>
      <FancyText text={props.post.data.summary} />
      {props.linkToComments && (
        <LinkContainer to={`/post/${props.post.id}`}>
          <Card.Link>{commentsPhrase}</Card.Link>
        </LinkContainer>
      )}
      <CensorLink target={props.post} />
    </VoteCard>
  );
}
