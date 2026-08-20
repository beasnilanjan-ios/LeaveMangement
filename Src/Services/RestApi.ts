import {BASE_URL} from './ApiConfig';
import {getAuthToken} from './AuthSession';

class RestApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = getAuthToken();

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

    console.log('========== API REQUEST ==========');
    console.log('URL:', url);
    console.log('Method:', options.method || 'GET');

    console.log('Headers:', {
      ...headers,
      Authorization: token ? 'Bearer ********' : undefined,
    });

    if (options.body) {
      try {
        console.log(
          'Request Body:',
          JSON.parse(options.body as string),
        );
      } catch {
        console.log('Request Body:', options.body);
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('========== API RESPONSE ==========');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);

      const text = await response.text();

      let json: any;

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = text;
      }

      console.log('Response Data:', json);

      if (!response.ok) {
        throw new Error(
          json?.message ||
            `Request failed with status ${response.status}`,
        );
      }

      return json as T;
    } catch (error) {
      console.error('========== API ERROR ==========');
      console.error('URL:', url);
      console.error('Error:', error);

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