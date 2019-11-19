// Returns a description of what is wrong, or null if the data validates.
export function validatePost(data: {
  author: string;
  board: string;
  summary: string;
  title: string;
  url?: string;
}): string | null {
  if (data.author.length === 0) {
    return "Every post must have an author.";
  }
  if (data.board.length === 0) {
    return "You must select a board to post to.";
  }
  if (data.summary.trim().length === 0) {
    return "Every post must have a summary.";
  }
  if (data.title.trim().length === 0) {
    return "Every post must have a title.";
  }
  if (data.url && !data.url.startsWith("http")) {
    return `${data.url} is not a valid URL.`;
  }

  return null;
}
