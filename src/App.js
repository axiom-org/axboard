import React from "react";
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

class Chat extends React.Component {
  constructor(props) {
    super(props);

    let { node } = props;
    this.state = {
      clicks: 0
    };

    node.subscribe("clicks", (sender, data) => {
      console.log(sender, data);
    });
    node.publish("clicks", "hello");
  }

  handleClick() {
    this.setState({ clicks: this.state.clicks + 1 });
  }

  render() {
    return (
      <div>
        <h1>P2P Click Counting</h1>
        <p>
          The count is {this.state.clicks}{" "}
          {this.state.clicks === 1 ? "click" : "clicks"}.
        </p>
        <button onClick={() => this.handleClick()}>Click me</button>
      </div>
    );
  }
}

export default App;
