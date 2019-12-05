import React, { useState } from "react";
import { AxiomObject } from "axiom-api";

import CommentCard from "./CommentCard";
import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";
import NewComment from "./NewComment";
import PostSummary from "./PostSummary";

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
      <NewComment post={post} />
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
