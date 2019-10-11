import React, { useState } from "react";
import { AxiomObject, Database } from "axiom-api";
import { Link } from "react-router-dom";

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
        <Link to={"/post/" + props.post.id}>
          Post: {props.post.data.content} (posted {ago(props.post.timestamp)})
        </Link>
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
