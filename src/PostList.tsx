import React from "react";
import { AxiomObject } from "axiom-api";

type CommentMap = { [parent: string]: { [key: string]: AxiomObject } };

type PostListProps = {
  posts: AxiomObject[];
  comments: CommentMap;
};

export default function PostList(props: PostListProps) {
  return <p>TODO</p>;
}
