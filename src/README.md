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

`post` - the id of the Post this comment is beneath

`parent` - the id of the Comment object this comment is on, if it isn't directly on a post

### Vote

`target` - the id of the object being voted on

`score` - either +1 or -1 depending on upvote or downvote
