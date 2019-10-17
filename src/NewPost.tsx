import React from "react";

import { useDataContext } from "./DataContext";
import InputForm from "./InputForm";

export default function NewPost(props: { board: string }) {
  let data = useDataContext();

  return (
    <InputForm
      name={"New post"}
      onSubmit={async content => {
        let post = await data.app.postdb.create({
          board: props.board,
          content: content
        });
        data.app.setState(state => ({
          posts: [post].concat(state.posts)
        }));
      }}
    />
  );
}
