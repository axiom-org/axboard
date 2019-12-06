import React from "react";
import Card from "react-bootstrap/Card";

import { Markdown } from "react-showdown";

export default function FancyText(props: { text: string }) {
  return (
    <Card.Text>
      <Markdown markup={props.text} />
    </Card.Text>
  );
}
