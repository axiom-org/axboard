import React, { useState } from "react";
import { AxiomObject, Database } from "axiom-api";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import UserReference from "./UserReference";
import { ago } from "./Util";

export default function PostSummary(props: { post: AxiomObject }) {
  let data = useDataContext();
  let comments = data.comments[props.post.id];
  let numComments = comments ? Object.keys(comments).length : 0;
  let commentsPhrase = `${numComments} comment${numComments === 1 ? "" : "s"}`;

  return (
    <div>
      <hr />
      {props.post.data.content}
      <div>
        posted by{" "}
        <UserReference
          username={props.post.data.author}
          publicKey={props.post.owner}
        />{" "}
        {ago(props.post.timestamp)}
      </div>
      <Link to={`/post/${props.post.id}`}>{commentsPhrase}</Link>
    </div>
  );
}
