import React, { useState } from "react";
import "./App.css";

import AxiomAPI from "axiom-api";

function App() {
  let axiom = new AxiomAPI({ verbose: true });
  let node = axiom.createNode();

  return (
    <div className="App">
      <Scanner node={node} />
    </div>
  );
}

function Scanner({ node }) {
  let [lines, setLines] = useState(["scanning the network..."]);

  setTimeout(() => {
    setLines([node.statusLine()].concat(lines));
  }, 2000);

  return (
    <div>
      <h1>P2P Network Scanner</h1>
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export default App;
