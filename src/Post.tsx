import React, { useState } from "react";
import { AxiomObject, Database } from "axiom-api";

import InputForm from "./InputForm";
import { ago } from "./Util";

export default function Post(props: {
  post: AxiomObject;
  comments: AxiomObject[];
  commentdb: Database;
  allowReply: boolean;
}) {
  let [comments, setComments] = useState(props.comments);
  return (
    <div>
      <hr />
      <p>
        Post: {props.post.data.content} (posted {ago(props.post.timestamp)})
      </p>
      {comments.map((comment, index) => (
        <p key={index}>
          Comment: {comment.data.content} ({ago(comment.timestamp)})
        </p>
      ))}
      {props.allowReply && (
        <InputForm
          name={"Reply"}
          onSubmit={async content => {
            let parent = props.post.id;
            let data = {
              parent: parent,
              content: content
            };
            let newComment = await props.commentdb.create(data);
            setComments([newComment].concat(comments));
          }}
        />
      )}
    </div>
  );
}
