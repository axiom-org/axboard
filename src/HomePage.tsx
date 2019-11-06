import React from "react";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function HomePage() {
  let data = useDataContext();
  let postlist = [];
  for (let id in data.posts) {
    let post = data.posts[id];
    postlist.push(post);
  }
  postlist.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div>
      <h2>Home Page</h2>
      <Link to={`/newpost/`}>new post</Link>
      <PostList posts={postlist} />
    </div>
  );
}
