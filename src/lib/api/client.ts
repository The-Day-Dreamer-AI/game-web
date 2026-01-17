import { API_CONFIG, AUTH_STORAGE_KEY } from "./config";

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  Code: number;
  Message: string;
  Data?: T;
}

// Error class for API errors
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Get stored auth token for external API
// Returns null if token doesn't exist or is invalid
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // First, check for direct "token" key in localStorage
  const directToken = localStorage.getItem("token");
  if (directToken && directToken.length > 50) {
    return directToken.trim();
  }

  // Fallback: check for token in aone-auth JSON object
  const authData = localStorage.getItem(AUTH_STORAGE_KEY);
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      const token = parsed.token || null;
      // Return token if it exists and has reasonable length
      if (token && token.length > 50) {
        return token.trim();
      }
      return null;
    } catch {
      return null;
    }
  }
  return null;
}

// Get current language
function getCurrentLanguage(): string {
  if (typeof window === "undefined") return API_CONFIG.defaultLanguage;
  return localStorage.getItem("aone-language") || API_CONFIG.defaultLanguage;
}

// Build headers for API requests
function buildHeaders(options?: {
  authenticated?: boolean;
  contentType?: string;
}): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    Lang: getCurrentLanguage(),
  };

  if (options?.contentType) {
    headers["Content-Type"] = options.contentType;
  }

  if (options?.authenticated !== false) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `bearer ${token.trim()}`;
    }
  }

  return headers;
}

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(endpoint, API_CONFIG.baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// Main API client
export const apiClient = {
  async get<T>(
    endpoint: string,
    options?: {
      params?: Record<string, string | number | undefined>;
      authenticated?: boolean;
    }
  ): Promise<T> {
    const url = buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "GET",
      headers: buildHeaders({ authenticated: options?.authenticated }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - don't redirect, just throw error
        // Let the calling code decide how to handle (e.g., fall back to unauthenticated endpoint)
        throw new ApiError(401, "Authentication required.", response.status);
      }
      throw new ApiError(response.status, `Request failed: ${response.statusText}`, response.status);
    }

    const data = await response.json();

    // Check for API-level errors
    if (data.Code && data.Code !== 0) {
      throw new ApiError(data.Code, data.Message || "An error occurred");
    }

    return data;
  },

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: {
      authenticated?: boolean;
    }
  ): Promise<T> {
    const url = buildUrl(endpoint);

    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders({
        authenticated: options?.authenticated,
        contentType: "application/json; charset=UTF-8",
      }),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError(401, "Authentication required.", response.status);
      }
      throw new ApiError(response.status, `Request failed: ${response.statusText}`, response.status);
    }

    const data = await response.json();

    if (data.Code && data.Code !== 0) {
      throw new ApiError(data.Code, data.Message || "An error occurred");
    }

    return data;
  },

  /**
   * POST request with form-urlencoded body (for login)
   */
  async postForm<T>(
    endpoint: string,
    body: Record<string, string>,
    options?: {
      authenticated?: boolean;
    }
  ): Promise<T> {
    const url = buildUrl(endpoint);

    const formBody = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formBody.append(key, value);
      }
    });

    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders({
        authenticated: options?.authenticated,
        contentType: "application/x-www-form-urlencoded",
      }),
      body: formBody.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      // Login errors have different format
      if (data.error) {
        throw new ApiError(response.status, data.error_description || data.error, response.status);
      }
      throw new ApiError(response.status, `Request failed: ${response.statusText}`, response.status);
    }

    return data;
  },

  /**
   * POST request with FormData (multipart/form-data) for file uploads
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: {
      authenticated?: boolean;
    }
  ): Promise<T> {
    const url = buildUrl(endpoint);

    // Build headers without Content-Type (browser sets it automatically with boundary for multipart)
    const headers: HeadersInit = {
      Accept: "application/json",
      Lang: getCurrentLanguage(),
    };

    if (options?.authenticated !== false) {
      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `bearer ${token.trim()}`;
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError(401, "Authentication required.", response.status);
      }
      throw new ApiError(response.status, `Request failed: ${response.statusText}`, response.status);
    }

    const data = await response.json();

    if (data.Code && data.Code !== 0) {
      throw new ApiError(data.Code, data.Message || "An error occurred");
    }

    return data;
  },
};
