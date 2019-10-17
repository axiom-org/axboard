import React from "react";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function UserDetail(props: { name: string; publicKey: string }) {
  let data = useDataContext();
  if (!data.postlist || !data.comments) {
    throw new Error("UserDetail needs posts and comments");
  }

  let posts = [];
  for (let post of data.postlist) {
    if (post.owner === props.publicKey) {
      posts.push(post);
    }
  }

  return (
    <div>
      <h2>
        posts from {props.name} ({props.publicKey}
        ):
      </h2>
      <PostList posts={posts} />
    </div>
  );
}
