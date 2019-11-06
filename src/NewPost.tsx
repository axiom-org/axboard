import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";

export default function NewPost(props: { board?: string }) {
  let data = useDataContext();
  let [id, setID] = useState("");
  let [content, setContent] = useState("");
  let [boardID, setBoardID] = useState(props.board);

  if (id.length > 0) {
    return <Redirect to={`/post/${id}`} />;
  }

  if (!data.username) {
    return <div>log in to post</div>;
  }
  let author: string = data.username;

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`posting ${content.length} bytes to ${boardID}`);
    let post = await data.app.createPost({
      author: author,
      board: boardID || "XXX",
      content: content
    });
    setID(post.id);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          New post:
          <br />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <br />
      <Link to="/newboard">create a new board</Link>
    </div>
  );
}
