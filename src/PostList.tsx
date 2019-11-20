import React from "react";
import Card from "react-bootstrap/Card";
import { AxiomObject } from "axiom-api";

import PostSummary from "./PostSummary";

export default function PostList(props: { posts: AxiomObject[] }) {
  if (props.posts.length === 0) {
    return (
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <Card.Text>There are no posts here, yet.</Card.Text>
        </Card.Body>
      </Card>
    );
  }
  return (
    <div>
      {props.posts.map((post, index) => {
        return <PostSummary key={index} post={post} linkToComments />;
      })}
    </div>
  );
}
