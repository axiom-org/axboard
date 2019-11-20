import React from "react";
import { AxiomObject } from "axiom-api";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";
import PostSummary from "./PostSummary";
import ReplyForm from "./ReplyForm";
import UserReference from "./UserReference";
import { ago } from "./Util";

function CommentCard(props: { comment: AxiomObject }) {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">
          posted by{" "}
          <UserReference
            username={props.comment.data.author}
            publicKey={props.comment.owner}
          />{" "}
          {ago(props.comment.timestamp)}
        </Card.Subtitle>
        <Card.Text>{props.comment.data.content}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default function PostDetail(props: { id: string }) {
  let data = useDataContext();
  let post = data.posts[props.id];
  if (!post) {
    return <ErrorPage text="The information for this post was not found." />;
  }
  let cmap = data.comments[props.id];

  let comments = [];
  for (let key in cmap) {
    comments.push(cmap[key]);
  }
  comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  let board = data.boards[post.data.board];

  return (
    <div>
      <PostSummary post={post} linkToComments={false} />
      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
      <ReplyForm post={post} />
    </div>
  );
}
