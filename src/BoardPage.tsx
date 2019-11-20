import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
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
  data.votes.sort(postlist);

  console.log("XXX", board.data);

  return (
    <div>
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <Card.Title>{"b/" + board.name}</Card.Title>
          <Card.Text>{board.data.description}</Card.Text>
          <LinkContainer to={`/newpost/${board.id}`}>
            <Card.Link>New post</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>
      <PostList posts={postlist} />
    </div>
  );
}
