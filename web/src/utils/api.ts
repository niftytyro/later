export const getRequestHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "http://localhost:8000");
  headers.append("Access-Control-Allow-Credentials", "true");
  return headers;
};

export const fetchApi = async (
  url: string,
  options?: {
    queryParams?: Record<string, string>;
    body?: object;
    method?: "GET" | "POST";
  }
) => {
  return (
    await fetch(
      options?.queryParams
        ? `http://localhost:8000${url}?${new URLSearchParams(
            options.queryParams
          )}`
        : `http://localhost:8000${url}`,
      {
        method: options?.method ?? "GET",
        headers: getRequestHeaders(),
        credentials: "include",
        body: options?.body ? JSON.stringify(options?.body) : undefined,
      }
    )
  ).json();
};
