export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * A wrapper around fetch that automatically includes credentials (cookies)
 * and the base API URL.
 */
export async function fetchClient(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    // This is crucial for sending and receiving HTTP-only cookies
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "An error occurred while fetching data.";
    try {
      const errorData = await response.clone().json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore JSON parse error on error response
    }
    throw new Error(errorMessage);
  }

  return response;
}
