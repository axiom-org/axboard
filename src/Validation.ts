export function validatePost(data: {
  author: string;
  board: string;
  summary: string;
  title: string;
  url: string;
}): boolean {
  if (data.summary.trim().length === 0 || data.title.trim().length === 0) {
    return false;
  }
  return true;
}
