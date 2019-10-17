## Schema

The data is separated into different logical databases, one for each object type. In TypeScript, they are all just `AxiomObject`, so this file
documents the different object types.

### Post

`author` - the username of the writer of the post

`board` - the id of the Board object this post is on

`content` - the text content of the post

### Comment

`author` - the username of the writer of the comment

`board` - the id of the Board object the parent post is on

`content` - the text content of the comment

`parent` - the id of the Post object this comment is on

### Vote

`target` - the id of the object being voted on

`score` - either +1 or -1 depending on upvote or downvote
