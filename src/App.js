import React, { useState } from "react";
import "./App.css";

import AxiomAPI from "axiom-api";

function App() {
  let axiom = new AxiomAPI({ network: "local", verbose: true });
  let node = axiom.createNode();

  return (
    <div className="App">
      <Chat node={node} />
    </div>
  );
}

function Chat({ node }) {
  setTimeout(() => {
    // XXX do stuff here
  }, 1000);

  return (
    <div>
      <h1>P2P Chat</h1>
    </div>
  );
}

export default App;
