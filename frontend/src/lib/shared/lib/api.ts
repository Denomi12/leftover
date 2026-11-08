import { API_URL } from '$app/env/public';
import { authTokenStore } from './auth-token-store';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const NETWORK_ERROR_STATUS = 0;

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown; fetch?: typeof fetch };

export async function api<T>(
  path: string,
  { body, headers, fetch: fetchFn = fetch, ...init }: RequestOptions = {},
) {
  const token = authTokenStore.get();

  let response: Response;
  try {
    response = await fetchFn(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(NETWORK_ERROR_STATUS, 'Network error');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new ApiError(response.status, message ?? response.statusText);
  }

  return data as T;
}
