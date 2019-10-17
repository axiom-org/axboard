import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";
import InputForm from "./InputForm";

export default function NewPost(props: { board: string }) {
  let data = useDataContext();
  let [id, setID] = useState("");

  if (id.length > 0) {
    return <Redirect to={`/post/${id}`} />;
  }

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
        setID(post.id);
      }}
    />
  );
}
