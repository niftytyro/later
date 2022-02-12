export const getRequestHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "http://localhost:8000");
  headers.append("Access-Control-Allow-Credentials", "true");
  return headers;
};
