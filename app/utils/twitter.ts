export const tweetIdParser = (url: string) => {
  const statusPos = url.indexOf("status/")
  url = url.slice((statusPos >= 0 ? statusPos : -7) + 7)
  if (url.indexOf("/") > -1) {
    url = url.slice(url.indexOf("/"))
  }
  if (url.indexOf("?") > -1) {
    url = url.slice(0, url.indexOf("?"))
  }
  return url
}
