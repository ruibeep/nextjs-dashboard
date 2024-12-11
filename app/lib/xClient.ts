const BASE_URL = 'https://api.twitter.com/2';

interface XApiError {
  title?: string;
  detail?: string;
  type?: string;
}

interface XApiResponse {
  data?: { id: string; text: string }[];
  errors?: XApiError[];
}

// A generic parameter type to allow optional query params
type QueryParams = Record<string, string | number | boolean>;

// Performs a search on X and retrieves posts
export async function fetchFromX(endpoint: string, params: QueryParams = {}): Promise<XApiResponse> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add query parameters if any
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, String(value));
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = (await res.json()) as XApiResponse;
    const errorMsg = errorData.errors ? JSON.stringify(errorData.errors) : res.statusText;
    throw new Error(`X API error: ${errorMsg}`);
  }

  return res.json() as Promise<XApiResponse>;
}

// Posts to X
export async function postToX<TRequest, TResponse>(endpoint: string, body: TRequest): Promise<TResponse> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = (await res.json()) as TResponse;
    throw new Error(`X API POST error: ${JSON.stringify(errorData)}`);
  }

  return res.json() as Promise<TResponse>;
}