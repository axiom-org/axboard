import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

import { useDataContext } from "./DataContext";
import ErrorPage from "./ErrorPage";
import FancyText from "./FancyText";
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

  let mine = data.keyPair && data.keyPair.getPublicKey() === board.owner;

  let postlist = Object.values(data.postsForBoard[props.id] || {});
  data.votes.sort(postlist);

  return (
    <div>
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <Card.Title>{"b/" + board.name}</Card.Title>
          <FancyText text={board.data.description} />
          <LinkContainer to={`/newpost/${board.id}`}>
            <Card.Link>New post</Card.Link>
          </LinkContainer>
          {mine && (
            <LinkContainer to={`/editboard/${board.id}`}>
              <Card.Link>Edit</Card.Link>
            </LinkContainer>
          )}
        </Card.Body>
      </Card>
      <PostList posts={postlist} />
    </div>
  );
}
