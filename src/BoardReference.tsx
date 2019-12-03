import React from "react";
import { AxiomObject } from "axiom-api";
import { Link } from "react-router-dom";

export default function BoardReference(props: { board: AxiomObject }) {
  return (
    <Link to={`/b/${props.board.name}/${props.board.id}`}>{`b/${
      props.board.name
    }`}</Link>
  );
}
