import React from "react";
import Card from "react-bootstrap/Card";

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
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <Card.Title>
            {"username: "}
            {props.name}
          </Card.Title>
          <Card.Text>
            {"public key: "}
            {props.publicKey}
          </Card.Text>
          <Card.Text>
            {"karma: "}
            {data.votes.getKarma(props.publicKey)}
          </Card.Text>
          <Card.Text>
            {postlist.length}
            {" post"}
            {postlist.length === 1 ? "" : "s"}
          </Card.Text>
        </Card.Body>
      </Card>
      <PostList posts={postlist} />
    </div>
  );
}
