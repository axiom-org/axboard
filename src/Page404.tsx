import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div>
      <p>404 error: No page matches this URL.</p>
      <br />
      <Link to={"/"}>Return to the home page.</Link>
    </div>
  );
}
