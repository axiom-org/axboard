import React from "react";
import { AxiomObject } from "axiom-api";

import { useDataContext } from "./DataContext";
import Post from "./Post";

function mostRecentFirst(map?: { [id: string]: AxiomObject }): AxiomObject[] {
  if (!map) {
    return [];
  }
  let comments = [];
  for (let key in map) {
    comments.push(map[key]);
  }
  comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return comments;
}

// Currently just shows the home page.
// Eventually should be extended to show a single board.
export default function PostList(props: { posts: AxiomObject[] }) {
  let data = useDataContext();

  if (!data.comments) {
    // TODO: show a loading screen
    throw new Error("PostList needs comments");
  }
  let comments = data.comments;

  return (
    <div>
      {props.posts.map((post, index) => {
        let clist = comments[post.id];
        return (
          <Post
            key={index}
            post={post}
            comments={mostRecentFirst(clist)}
            commentdb={data.app.commentdb}
            allowReply={!!data.keyPair}
          />
        );
      })}
    </div>
  );
}
