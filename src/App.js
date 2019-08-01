import React from "react";
import "./App.css";

import AxiomAPI from "axiom-api";

export default function App() {
  let axiom = new AxiomAPI({ verbose: true });
  let node = axiom.createNode();

  return (
    <div className="App">
      <Chat node={node} />
    </div>
  );
}

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.node = props.node;
    this.state = {
      clicks: 0
    };

    this.node.subscribe("clicks", (sender, data) => {
      this.setState({ clicks: this.state.clicks + 1 });
    });
  }

  render() {
    return (
      <div>
        <h1>P2P Click Counting</h1>
        <p>
          The count is {this.state.clicks}{" "}
          {this.state.clicks === 1 ? "click" : "clicks"}.
        </p>
        <button
          onClick={() => {
            this.node.publish("clicks", "no data");
          }}
        >
          Click me
        </button>
      </div>
    );
  }
}
