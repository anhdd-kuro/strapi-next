/**
 * API utilities for Strapi
 */

/**
 * Base URL for Strapi API 
 * In production, this would be an environment variable
 */
export const API_URL = 'http://localhost:1337';

/**
 * Fetch data from Strapi API
 * @param path - API endpoint path
 * @param urlParams - Query parameters
 */
export const fetchAPI = async <T>(
  path: string,
  urlParams: Record<string, string> = {},
): Promise<T> => {
  // Create URL with path and params
  const queryString = new URLSearchParams(urlParams).toString();
  const url = `${API_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

  try {
    // Make the request with proper headers
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
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
    console.error('API request error:', error);
    throw error;
  }
};
