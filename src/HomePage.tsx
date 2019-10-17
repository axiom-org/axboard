import React from "react";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function HomePage() {
  let data = useDataContext();
  let postlist = [];
  for (let id in data.posts) {
    let post = data.posts[id];
    postlist.push(post);
  }
  console.log(postlist);
  postlist.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div>
      <h2>Home Page</h2>
      <PostList posts={postlist} />
    </div>
  );
}
