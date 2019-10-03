import React, { useState } from "react";

export default function InputForm(props: {
  onSubmit: (content: string) => void;
  name: string;
  password?: boolean;
}) {
  let [content, setContent] = useState("");

  let handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(`submitting ${content}`);
    props.onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {props.name}:<br />
        <input
          type={props.password ? "password" : "text"}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
