import React from "react";

import { useDataContext } from "./DataContext";
import InputForm from "./InputForm";

export default function NewPost(props: { board: string }) {
  let data = useDataContext();

  if (!data.username) {
    return <div>log in to post</div>;
  }

  return (
    <InputForm
      name={"New post"}
      onSubmit={async content => {
        let post = await data.app.postdb.create({
          author: data.username,
          board: props.board,
          content: content
        });
        data.app.setState(state => ({
          postlist: [post].concat(state.postlist)
        }));
      }}
    />
  );
}
