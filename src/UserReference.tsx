import React from "react";
import { Link } from "react-router-dom";

export default function UserReference(props: {
  username?: string;
  publicKey: string;
}) {
  let username = props.username || "anonymous";
  return <Link to={`/u/${username}/${props.publicKey}`}>{username}</Link>;
}
