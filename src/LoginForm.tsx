import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useDataContext } from "./DataContext";

export default function LoginForm() {
  let data = useDataContext();
  let [username, setUsername] = useState("");
  let [passphrase, setPassphrase] = useState("");
  let [repeatPassphrase, setRepeatPassphrase] = useState("");

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

  let active = username.length > 1 && passphrase === repeatPassphrase;

  return (
    <div>
      <br />
      <h2>Log In</h2>
      <br />
      If you forget your passphrase, there is no way to recover your account. So
      you might want to write down your passphrase somewhere.
      <br />
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e: any) =>
              setUsername(e.target.value.replace(/[\W_]/g, ""))
            }
          />
        </Form.Group>
        <Form.Group controlId="formPassphrase">
          <Form.Label>Passphrase</Form.Label>
          <Form.Control
            type="password"
            value={passphrase}
            onChange={(e: any) => setPassphrase(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formRepeatPassphrase">
          <Form.Label>Repeat your passphrase</Form.Label>
          <Form.Control
            type="password"
            value={repeatPassphrase}
            onChange={(e: any) => setRepeatPassphrase(e.target.value)}
          />
        </Form.Group>
        <Button
          disabled={!active}
          variant="primary"
          type="submit"
          value="Log In"
        >
          Log In
        </Button>
      </Form>
    </div>
  );
}
