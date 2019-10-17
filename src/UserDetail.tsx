import React from "react";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function UserDetail(props: { name: string; publicKey: string }) {
  let data = useDataContext();

  let postlist = [];
  for (let id in data.posts) {
    let post = data.posts[id];
    if (post.owner === props.publicKey) {
      postlist.push(post);
    }
  }
  postlist.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div>
      <h2>
        posts from {props.name} ({props.publicKey}
        ):
      </h2>
      <PostList posts={postlist} />
    </div>
  );
}
