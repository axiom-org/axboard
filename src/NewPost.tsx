import React, { useState } from "react";
import { AxiomObject } from "axiom-api";
import { Link, Redirect } from "react-router-dom";

import { useDataContext } from "./DataContext";

function BoardDropDown(props: {
  boards: AxiomObject[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  let onChange = (e: any) => {
    let value = e.target.value || undefined;
    props.onSelect(value);
  };
  return (
    <div>
      <select value={props.selected} onChange={onChange}>
        <option value="" key="">
          select a board
        </option>
        {props.boards.map(board => (
          <option value={board.id} key={board.id}>
            {board.name}
          </option>
        ))}
      </select>
    </div>
  );
}

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

  let boards = Object.values(data.boards);
  boards.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          New post:
          <br />
          {!props.board && (
            <BoardDropDown
              boards={boards}
              selected={boardID}
              onSelect={setBoardID}
            />
          )}
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
