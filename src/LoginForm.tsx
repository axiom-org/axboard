import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";

export default function LoginForm() {
  let data = useDataContext();
  let [username, setUsername] = useState("");
  let [passphrase, setPassphrase] = useState("");

  if (data.keyPair) {
    // Already logged in
    return <Redirect to="/" />;
  }

  let handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: focus the first empty field if there is one
    try {
      data.app.login(username, passphrase);
    } catch (e) {
      // TODO: display this more nicely
      alert(e);
      setUsername("");
      setPassphrase("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        username:
        <br />
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        passphrase:
        <br />
        <input
          type="password"
          value={passphrase}
          onChange={e => setPassphrase(e.target.value)}
        />
      </label>
      <input type="submit" value="log in" />
    </form>
  );
}
