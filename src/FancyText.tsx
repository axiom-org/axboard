import React from "react";

import { Markdown } from "react-showdown";

export default function FancyText(props: { text: string }) {
  return <Markdown markup={props.text} simplifiedAutoLink />;
}
