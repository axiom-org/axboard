import React from "react";
import { KeyPair } from "axiom-api";

import InputForm from "./InputForm";

export default function LoginForm(props: { onSubmit: (kp: KeyPair) => void }) {
  return (
    <InputForm
      name={"Log in with your passphrase to post or comment"}
      password={true}
      onSubmit={phrase => {
        let kp = KeyPair.fromSecretPhrase(phrase);
        props.onSubmit(kp);
      }}
    />
  );
}
