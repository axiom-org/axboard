import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

import { useDataContext } from "./DataContext";
import PostList from "./PostList";

function TopCard() {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Title>Welcome to Axboard</Card.Title>
        <Card.Text>
          Axboard is a decentralized message board. Your browser participates in
          a peer-to-peer network that stores the Axboard data. There is no
          central database that can be censored, and it is entirely open-source.
          Enjoy!
        </Card.Text>
        <LinkContainer to="/about">
          <Card.Link>Learn more</Card.Link>
        </LinkContainer>
        <LinkContainer to="/login">
          <Card.Link>Create an account</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

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
      {!data.username && <TopCard />}
      <PostList posts={postlist} />
    </div>
  );
}
