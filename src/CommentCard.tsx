import React, { useState } from "react";
import { AxiomObject } from "axiom-api";
import Card from "react-bootstrap/Card";

import CensorLink from "./CensorLink";
import NewComment from "./NewComment";
import UserReference from "./UserReference";
import { ago } from "./Util";
import VoteCard from "./VoteCard";

export default function CommentCard(props: {
  comment: AxiomObject;
  post: AxiomObject;
  setReplyTo: (s: string) => void;
  replyForm: boolean;
  indentation: number;
}) {
  let style = { marginLeft: `${props.indentation * 20}px` };
  return (
    <div style={style}>
      <VoteCard target={props.comment}>
        <Card.Subtitle className="mb-2 text-muted">
          <small>
            <UserReference
              username={props.comment.data.author}
              publicKey={props.comment.owner}
            />{" "}
            - {ago(props.comment.timestamp)}
          </small>
        </Card.Subtitle>
        <Card.Text>{props.comment.data.content}</Card.Text>
        <Card.Link
          href=""
          onClick={(e: any) => {
            e.preventDefault();
            props.setReplyTo(props.comment.id);
          }}
        >
          reply
        </Card.Link>
        <CensorLink target={props.comment} />
      </VoteCard>
      {props.replyForm && (
        <NewComment
          post={props.post}
          parent={props.comment}
          cancel={() => props.setReplyTo("")}
        />
      )}
    </div>
  );
}
