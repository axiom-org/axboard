import React, { useState } from "react";
import { AxiomObject } from "axiom-api";
import Card from "react-bootstrap/Card";

import CommentForm from "./CommentForm";
import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";
import PostSummary from "./PostSummary";
import UserReference from "./UserReference";
import { ago } from "./Util";
import VoteCard from "./VoteCard";

function CommentCard(props: {
  comment: AxiomObject;
  post: AxiomObject;
  setReplyTo: (s: string) => void;
  replyForm: boolean;
  indentation: number;
}) {
  return (
    <div>
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
      </VoteCard>
      {props.replyForm && (
        <CommentForm
          post={props.post}
          parent={props.comment}
          cancel={() => props.setReplyTo("")}
        />
      )}
    </div>
  );
}

export default function PostDetail(props: { id: string }) {
  let data = useDataContext();
  let post = data.posts[props.id];
  let [replyTo, setReplyTo] = useState("");
  if (!post) {
    return <ErrorPage text="The information for this post was not found." />;
  }

  let cmap = data.comments[props.id];
  let comments = [];
  for (let key in cmap) {
    comments.push(cmap[key]);
  }
  data.votes.sort(comments);

  let root = [];
  let submap: { [id: string]: AxiomObject[] } = {};
  for (let comment of comments) {
    if (!comment.data.parent) {
      root.push(comment);
      continue;
    }
    if (!submap[comment.data.parent]) {
      submap[comment.data.parent] = [];
    }
    submap[comment.data.parent].push(comment);
  }

  let ordered: AxiomObject[] = [];
  let indentation: { [id: string]: number } = {};
  let add = (comment: AxiomObject, indent: number) => {
    ordered.push(comment);
    indentation[comment.id] = indent;
    if (!submap[comment.id]) {
      return;
    }
    for (let subcomment of submap[comment.id]) {
      add(subcomment, indent + 1);
    }
  };
  for (let comment of root) {
    add(comment, 0);
  }

  return (
    <div>
      <PostSummary post={post} linkToComments={false} />
      <CommentForm post={post} />
      {ordered.map((comment, index) => (
        <CommentCard
          key={index}
          post={post}
          comment={comment}
          replyForm={comment.id === replyTo}
          setReplyTo={setReplyTo}
          indentation={indentation[comment.id]}
        />
      ))}
    </div>
  );
}
