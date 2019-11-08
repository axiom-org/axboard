import React from "react";
import { Link } from "react-router-dom";
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
  postlist.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div>
      <Card>
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
