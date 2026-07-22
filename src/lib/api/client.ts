import { ApiError, ApiErrorPayload } from "@/lib/api/errors";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


export interface FetchClientOptions extends Omit<RequestInit, "body"> {
  /** The API endpoint path, e.g. "/sessions" */
  url: string;
  /** Query-string params — undefined/null values are omitted automatically. */
  params?: object;
  /** Request body — plain objects are auto-serialised to JSON. */
  body?: BodyInit | object | null;
  /** Request data — alias for body */
  data?: BodyInit | object | null;
}

/**
 * A typed fetch wrapper that:
 *  - Accepts a single options object (url, method, params, body, …)
 *  - Auto-builds query strings from `params`
 *  - Auto-serialises plain-object `body` values to JSON
 *  - Parses the response and unwraps `json.data`
 *  - Throws a typed `ApiError` on non-2xx responses
 */
export async function fetchClient<T = unknown>(
  options: FetchClientOptions,
): Promise<T> {
  const { url: endpoint, params, body, data, ...rest } = options;
  const actualBody = body !== undefined ? body : data;

  // Build query string from params, skipping undefined/null entries
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params as Record<string, unknown>).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined && value !== null) acc[key] = String(value);
        return acc;
      }, {}),
    ).toString();
    if (qs) url += `?${qs}`;
  }

  // Serialize plain objects to JSON; leave BodyInit values (string, FormData, etc.) as-is
  const serializedBody: BodyInit | null | undefined =
    actualBody !== null &&
    actualBody !== undefined &&
    typeof actualBody === "object" &&
    !(actualBody instanceof FormData) &&
    !(actualBody instanceof URLSearchParams) &&
    !(actualBody instanceof Blob) &&
    !(actualBody instanceof ArrayBuffer) &&
    !(actualBody instanceof ReadableStream)
      ? JSON.stringify(actualBody)
      : (actualBody as BodyInit | null | undefined);

  const headers = new Headers(rest.headers);
  if (!headers.has("Content-Type") && !(actualBody instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...rest,
    body: serializedBody,
    headers,
    // This is crucial for sending and receiving HTTP-only cookies
    credentials: "include",
  });

  if (!response.ok) {
    let errorData: any = {};
    let errorMessage = "An error occurred while fetching data.";
    try {
      errorData = await response.clone().json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse error on error response
    }

    const payload: ApiErrorPayload = {
      statusCode: response.status,
      code:
        errorData.code ||
        (response.status === 401
          ? "unauthorized"
          : response.status === 403
            ? "forbidden"
            : "unknown_error"),
      message: errorMessage,
      error: errorData.error,
      meta: errorData.meta,
      timestamp: errorData.timestamp,
      path: errorData.path,
      requestId: errorData.requestId,
    };

    throw new ApiError(payload, response.status);
  }

  const json = await response.json();
  return json.data as T;
}
