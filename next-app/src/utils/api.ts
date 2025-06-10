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
        urlParams: Record<string, unknown>;
      }
): Promise<T> => {
  let url: URL;
  if (params instanceof URL) {
    url = params;
  } else {
    url = new URL(params.path, API_URL);
    url.search = qs.stringify(params.urlParams);
  }

  try {
    // Make the request with proper headers
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};
