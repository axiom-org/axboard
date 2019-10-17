import React from "react";
import { AxiomObject } from "axiom-api";

import PostSummary from "./PostSummary";

export default function PostList(props: { posts: AxiomObject[] }) {
  return (
    <div>
      {props.posts.map((post, index) => {
        return <PostSummary key={index} post={post} />;
      })}
    </div>
  );
}
