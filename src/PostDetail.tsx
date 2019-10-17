import React from "react";

import { useDataContext } from "./DataContext";
import ReplyForm from "./ReplyForm";
import { ago } from "./Util";

export default function PostDetail(props: { id: string }) {
  let data = useDataContext();
  let post = data.posts[props.id];
  if (!post) {
    return <div>post not found</div>;
  }
  let cmap = data.comments[props.id];

  let comments = [];
  for (let key in cmap) {
    comments.push(cmap[key]);
  }
  comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div>
      <h2>Post Detail ({props.id})</h2>
      {post.data.content}
      {comments.map((comment, index) => (
        <p key={index}>
          Comment: {comment.data.content} ({ago(comment.timestamp)})
        </p>
      ))}
      <ReplyForm post={post} />
    </div>
  );
}
