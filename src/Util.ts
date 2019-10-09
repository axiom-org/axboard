// Creates a string like "2 days ago"
export function ago(date: Date): string {
  let helper = (num: number, term: string) => {
    if (num === 1) {
      return `1 ${term} ago`;
    }
    return `${num} ${term}s ago`;
  };

  let now = new Date();
  let ms = now.getTime() - date.getTime();
  if (ms < 0) {
    return "in the future";
  }
  if (ms < 1000) {
    return "just now";
  }
  let seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return helper(seconds, "second");
  }
  let minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return helper(minutes, "minute");
  }
  let hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return helper(hours, "hour");
  }
  let days = Math.floor(hours / 24);
  if (days < 30) {
    return helper(days, "day");
  }
  // This is a little bit inaccurate. Hopefully it's fine
  let months = Math.floor(days / 30);
  if (months < 12) {
    return helper(months, "month");
  }
  let years = Math.floor(months / 12);
  return helper(years, "year");
}

export function daysAgo(date: Date): number {
  let msPerDay = 1000 * 60 * 60 * 24;
  let now = new Date();
  let ms = now.getTime() - date.getTime();
  return ms / msPerDay;
}
