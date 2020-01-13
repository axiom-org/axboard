import React from "react";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

import FancyText from "./FancyText";

let text = `
Axboard is a decentralized message board.

What makes it decentralized? The fundamental data behind a message
board is the data that changes over time. Posts, comments, votes, user
data, and some other bits. Also known as the "application data". In a
normal web application, application data is stored in a database that is
controlled by a single company. With Axboard, application data is
replicated across many databases, controlled by anyone who uses
Axboard.

Axboard is a
[single-page
application](https://en.wikipedia.org/wiki/Single-page_application). That
means that only a single static bundle of files is hosted at
[https://axboard.com](https://axboard.com). When you load this page in
your web browser, your browser becomes a node in a peer-to-peer
network. Your browser constructs a local database, synchronizes
enough application data to load the application, and then displays the
application. In the background your browser stays part of the
peer-to-peer network while you browse the site.

The peer-to-peer network runs over
[WebRTC](https://en.wikipedia.org/wiki/WebRTC), a peer-to-peer
protocol that has relatively recently become standard in
browsers. WebRTC powers other peer-to-peer protocols as well, like
[WebTorrent](https://en.wikipedia.org/wiki/WebTorrent).

In particular, this means that you can run your own version of
Axboard, without having to operate a production database. You don't
have to make a copy of the application data - your version of Axboard can run
off the same peer-to-peer data network as axboard.com
does. Specific instructions on how to do this are available [on
GitHub](https://github.com/axiom-org/axboard).

The underlying framework that makes this possible is also separated
out as the Axiom library. (TODO: link the docs once they are good) Axiom provides both a
JavaScript API and a command line tool for running nodes that aren't tied to a browse
instance. You can use Axiom to create your own decentralized
applications - Axboard is just a proof of concept to show what's
possible.

If you have questions, try posting them in
[b/axboard](http://localhost:3000/#/b/axboard/0x9b41b26b6b68416b2c9f01339773d4c997c5e5e3533bf40b098a8e41e7aefb84f6dc:axboard). You
can also [follow me on Twitter](https://twitter.com/lacker), and
[report Axboard bugs on GitHub](https://github.com/axiom-org/axboard/issues).
`;

export default function About() {
  return (
    <Card style={{ marginTop: "10px" }}>
      <Card.Body>
        <Card.Title>About Axboard</Card.Title>
        <FancyText text={text} />
        <LinkContainer to="/">
          <Card.Link>Return to the home page.</Card.Link>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
