import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";
import PostList from "./PostList";

export default function BoardPage(props: { id: string; name?: string }) {
  let data = useDataContext();

  let board = data.boards[props.id];
  if (!board) {
    return <ErrorPage text="The information for this board was not found." />;
  }
  if (props.name && props.name !== board.name) {
    return <ErrorPage text="This link is no longer valid." />;
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
