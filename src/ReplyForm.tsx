import React from "react";
import { AxiomObject } from "axiom-api";

import { useDataContext } from "./DataContext";
import InputForm from "./InputForm";

export default function ReplyForm(props: { post: AxiomObject }) {
  let data = useDataContext();
  if (!data.username) {
    return null;
  }
  let author: string = data.username;

  return (
    <InputForm
      name={"Reply"}
      onSubmit={async content => {
        await data.app.createComment({
          author,
          board: props.post.data.board,
          content,
          parent: props.post.id
        });
      }}
    />
  );
}
