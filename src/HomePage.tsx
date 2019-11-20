import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

export default function HomePage() {
  let data = useDataContext();
  let postlist = [];
  for (let id in data.posts) {
    let post = data.posts[id];
    postlist.push(post);
  }

  data.votes.sort(postlist);

  return (
    <div>
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <Card.Title>Home Page</Card.Title>
          <LinkContainer to="/newpost/">
            <Card.Link>New Post</Card.Link>
          </LinkContainer>
        </Card.Body>
      </Card>
      <PostList posts={postlist} />
    </div>
  );
}
