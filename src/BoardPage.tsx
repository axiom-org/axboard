import React from "react";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function BoardPage(props: { id: string; name?: string }) {
  let data = useDataContext();

  let board = data.boards[props.id];
  if (!board) {
    return <div>board not found</div>;
  }
  if (props.name && props.name !== board.name) {
    return <div>the board has been renamed</div>;
  }

  let postlist = [];
  for (let id in data.posts) {
    let post = data.posts[id];
    if (post.data.board === props.id) {
      postlist.push(post);
    }
  }
  postlist.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div>
      <h2>{"b/" + board.name}</h2>
      <Link to={`/newpost/${board.id}`}>new post</Link>
      <PostList posts={postlist} />
    </div>
  );
}
