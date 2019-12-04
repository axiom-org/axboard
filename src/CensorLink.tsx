import React from "react";
import { AxiomObject } from "axiom-api";
import Card from "react-bootstrap/Card";

import { useDataContext } from "./DataContext";

export default function CensorLink(props: { target: AxiomObject }) {
  let data = useDataContext();
  if (
    !data.keyPair ||
    !props.target.data.board ||
    !props.target.data.board.startsWith(data.keyPair.getPublicKey())
  ) {
    return null;
  }
  return (
    <Card.Link
      href=""
      onClick={(e: any) => {
        e.preventDefault();
        data.app.censor(props.target.id);
      }}
    >
      censor
    </Card.Link>
  );
}
