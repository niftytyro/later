import dayjs, { Dayjs } from "dayjs"

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
]

export const getTweetDate = (date: Dayjs) => {
  const today = dayjs()
  const secsDiff = today.diff(date, "seconds")
  const minsDiff = today.diff(date, "minutes")
  const hoursDiff = today.diff(date, "hours")
  const dateDiff = today.diff(date, "days")
  const yearDiff = today.diff(date, "years")

  if (yearDiff > 0) {
    return `${date.date()} ${monthNames[date.month()]} ${date.year()}`
  }

  if (dateDiff > 0) {
    if (dateDiff > 1) {
      return `${date.date()} ${monthNames[date.month()]}`
    }
    return "1d"
  }

  if (hoursDiff > 0) {
    return `${hoursDiff}h`
  }

  if (minsDiff > 0) {
    return `${minsDiff}m`
  }

  if (secsDiff > 0) {
    return `${secsDiff}s`
  }
}
