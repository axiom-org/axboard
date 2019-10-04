import React from "react";
import { AxiomObject, Database } from "axiom-api";

import InputForm from "./InputForm";

export default function Post(props: {
  post: AxiomObject;
  comments: AxiomObject[];
  commentdb: Database;
  allowReply: boolean;
}) {
  return (
    <div>
      <hr />
      <p>Post: {props.post.data.content}</p>
      {props.comments.map((comment, index) => (
        <p key={index}>Comment: {comment.data.content}</p>
      ))}
      {props.allowReply && (
        <InputForm
          name={"Reply"}
          onSubmit={content => {
            let parent = props.post.id;
            let data = {
              parent: parent,
              content: content
            };
            props.commentdb.create(data);
          }}
        />
      )}
    </div>
  );
}
