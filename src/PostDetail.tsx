import React from "react";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";
import ReplyForm from "./ReplyForm";
import UserReference from "./UserReference";
import { ago } from "./Util";

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
      <h2>Post Detail ({props.id})</h2>
      <div>
        posted by{" "}
        <UserReference username={post.data.author} publicKey={post.owner} />{" "}
        {ago(post.timestamp)}
        {board && (
          <div>
            in{" "}
            <Link to={`/b/${board.name}/${board.id}`}>{`b/${board.name}`}</Link>
          </div>
        )}
      </div>
      {post.data.content}
      {comments.map((comment, index) => (
        <p key={index}>
          Comment: {comment.data.content}
          <br />
          by{" "}
          <UserReference
            username={comment.data.author}
            publicKey={comment.owner}
          />{" "}
          ({ago(comment.timestamp)})
        </p>
      ))}
      <ReplyForm post={post} />
    </div>
  );
}
