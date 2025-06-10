/**
 * API utilities for Strapi
 */

import path from "path";
import { URL } from "url";
import qs from "qs";

/**
 * Base URL for Strapi API
 * In production, this would be an environment variable
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/**
 * Fetch data from Strapi API
 * @param path - API endpoint path
 * @param urlParams - Query parameters
 */
export const fetchCMS = async <T>(
  params:
    | URL
    | {
        path: string;
        urlParams?: Record<string, unknown>; // Make urlParams optional
      },
  options: RequestInit = {} // Add options parameter for method, headers, body
): Promise<T> => {
  let url: URL;
  if (params instanceof URL) {
    url = params;
  } else {
    url = new URL(params.path, API_URL);
    if (params.urlParams) {
      url.search = qs.stringify(params.urlParams);
    }
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      // Try to parse error response for more details
      try {
        const errorData = await response.json();
        console.error("API Error Data:", errorData);
        throw new Error(
          errorData.error?.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      } catch (jsonError) {
        // If response is not JSON, throw generic error
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    if (response.status === 204) {
      return {} as T; // Or null, depending on expected behavior
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request error:", url.toString(), options, error);
    throw error;
  }
};
