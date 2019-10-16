import React from "react";
import { Link } from "react-router-dom";

import { useDataContext } from "./DataContext";
import InputForm from "./InputForm";
import LoginForm from "./LoginForm";

export default function Header() {
  let data = useDataContext();

  if (!data.keyPair) {
    return <Link to={"/login"}>log in</Link>;
  }
  return (
    <div>
      <p>logged in as {data.keyPair.getPublicKey()}</p>
      <InputForm
        name={"New post"}
        onSubmit={async content => {
          let post = await data.app.postdb.create({ content: content });
          data.app.setState(state => ({
            posts: [post].concat(state.posts)
          }));
        }}
      />
    </div>
  );
}
