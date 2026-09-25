import { BASE_URL } from './ApiConfig';
import { getAuthToken } from './AuthSession';
import ApiLogger from './ApiLogger';

class RestApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = getAuthToken();
    console.log('Auth Token:', token); // Log the token for debugging purposes

    const url = `${BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Allow individual API calls to override headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const requestId = ApiLogger.createRequestId();
    const start = Date.now();

    let parsedRequestBody: any = undefined;
    if (options.body) {
      try {
        parsedRequestBody = JSON.parse(options.body as string);
      } catch {
        parsedRequestBody = options.body;
      }
    }

    ApiLogger.logApi({
      id: requestId,
      type: 'request',
      method: options.method || 'GET',
      url,
      headers,
      body: parsedRequestBody,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const durationMs = Date.now() - start;

      const text = await response.text();

      let json: any;

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = text;
      }

      ApiLogger.logApi({
        id: requestId,
        type: 'response',
        method: options.method || 'GET',
        url,
        status: response.status,
        ok: response.ok,
        durationMs,
        body: parsedRequestBody,
        headers,
        // attach small response payload
        // put response into `body` field for consistency
        body: undefined,
      });

      ApiLogger.logApi({
        id: requestId,
        type: 'response',
        method: options.method || 'GET',
        url,
        status: response.status,
        ok: response.ok,
        durationMs,
        body: json,
      });

      if (!response.ok) {
        throw new Error(
          json?.message ||
          `Request failed with status ${response.status}`,
        );
      }

      return json as T;
    } catch (error) {
      const durationMs = Date.now() - start;
      ApiLogger.logApi({
        id: requestId,
        type: 'error',
        method: options.method || 'GET',
        url,
        durationMs,
        error,
      });

      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new RestApi();