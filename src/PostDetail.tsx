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

  return (
    <div>
      <PostSummary post={post} linkToComments={false} />
      <CommentForm post={post} />
      {comments.map((comment, index) => (
        <CommentCard
          key={index}
          post={post}
          comment={comment}
          replyForm={comment.id === replyTo}
          setReplyTo={setReplyTo}
        />
      ))}
    </div>
  );
}
