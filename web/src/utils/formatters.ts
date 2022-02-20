import dayjs, { Dayjs } from "dayjs";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatTweetDate = (date: Dayjs) => {
  const now = dayjs();
  const secsDiff = now.diff(date, "seconds");
  const minsDiff = now.diff(date, "minutes");
  const hoursDiff = now.diff(date, "hours");
  const dateDiff = now.diff(date, "days");
  const yearDiff = now.diff(date, "years");

  if (yearDiff > 0) {
    return `${date.date()} ${monthNames[date.month()]} ${date.year()}`;
  }

  if (dateDiff > 0) {
    if (dateDiff > 1) {
      return `${date.date()} ${monthNames[date.month()]}`;
    }
    return "1d";
  }

  if (hoursDiff > 0) {
    return `${hoursDiff}h`;
  }

  if (minsDiff > 0) {
    return `${minsDiff}m`;
  }

  if (secsDiff > 0) {
    return `${secsDiff}s`;
  }
  return "now";
};

export const postIdToLink = (postId: string, username: string) => {
  return `https://twitter.com/${username}/status/${postId}`;
};
