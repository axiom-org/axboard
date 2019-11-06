import React from "react";
import { AxiomObject } from "axiom-api";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import UserReference from "./UserReference";
import { ago } from "./Util";

export default function PostSummary(props: { post: AxiomObject }) {
  let data = useDataContext();
  let comments = data.comments[props.post.id];
  let numComments = comments ? Object.keys(comments).length : 0;
  let commentsPhrase = `${numComments} comment${numComments === 1 ? "" : "s"}`;

  let board = data.boards[props.post.data.board];

  let canVote =
    data.keyPair && data.keyPair.getPublicKey() !== props.post.owner;

  return (
    <div>
      <hr />
      {props.post.data.content}
      <div>
        posted by{" "}
        <UserReference
          username={props.post.data.author}
          publicKey={props.post.owner}
        />{" "}
        {ago(props.post.timestamp)}
        {board && (
          <div>
            in{" "}
            <Link to={`/b/${board.name}/${board.id}`}>{`b/${board.name}`}</Link>
          </div>
        )}
      </div>
      <Link to={`/post/${props.post.id}`}>{commentsPhrase}</Link>
      <div>score: {data.votes.getScore(props.post.id)}</div>
      {canVote && (
        <div onClick={() => data.app.upvote(props.post.id)}>upvote</div>
      )}
      {canVote && (
        <div onClick={() => data.app.downvote(props.post.id)}>downvote</div>
      )}
    </div>
  );
}
