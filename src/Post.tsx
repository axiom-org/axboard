import React from "react";
import { Database, SignedMessage } from "axiom-api";

import InputForm from "./InputForm";

export default function Post(props: {
  post: SignedMessage;
  comments: SignedMessage[];
  commentdb: Database;
  allowReply: boolean;
}) {
  return (
    <div>
      <hr />
      <p>Post: {props.post.message.data.content}</p>
      {props.comments.map((sm, index) => (
        <p key={index}>Comment: {sm.message.data.content}</p>
      ))}
      {props.allowReply && (
        <InputForm
          name={"Reply"}
          onSubmit={content => {
            let parent = props.post.signer + ":" + props.post.message.name;
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
