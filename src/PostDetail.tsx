import React from "react";

import { useDataContext } from "./DataContext";
import { ago } from "./Util";

export default function PostDetail(props: { id: string }) {
  let data = useDataContext();
  if (!data.comments) {
    throw new Error("TODO: need to reload");
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
      {comments.map((comment, index) => (
        <p key={index}>
          Comment: {comment.data.content} ({ago(comment.timestamp)})
        </p>
      ))}
    </div>
  );
}
