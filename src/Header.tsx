import React from "react";

import { useDataContext } from "./DataContext";
import InputForm from "./InputForm";
import LoginForm from "./LoginForm";

export default function Header() {
  let data = useDataContext();

  if (data.keyPair) {
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

  return (
    <LoginForm
      onSubmit={keyPair => {
        data.app.channel.setKeyPair(keyPair);
        data.app.setState({ keyPair });
      }}
    />
  );
}
