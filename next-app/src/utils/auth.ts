/**
 * Authentication utilities for Strapi
 */

import { jwtDecode } from "jwt-decode";
import { API_URL } from "./api";
import {
  StrapiLoginResponse,
  StrapiUser,
  StrapiUsersMeResponse,
} from "../types/strapi";

// JWT token management
type JWTPayload = {
  id: number;
  iat: number;
  exp: number;
};

const TOKEN_KEY = "auth-token";

/**
 * Store JWT token in cookie (client-side)
 */
export const setToken = (token: string): void => {
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=2592000; SameSite=Lax`;
  }
};

/**
 * Get JWT token from cookie (client-side)
 */
export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`));
  return match ? match[2] : null;
};

/**
 * Remove JWT token from cookie (client-side)
 */
export const removeToken = (): void => {
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Check if user is authenticated (client-side)
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

/**
 * Login user with email and password
 */
export const login = async (
  identifier: string,
  password: string
): Promise<StrapiLoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Authentication failed");
    }

    const data: StrapiLoginResponse = await response.json();
    setToken(data.jwt);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeToken();
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Fetch current user data
 */
export const getCurrentUser = async (): Promise<StrapiUser | null> => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/users/me?populate=role`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid or expired
        removeToken();
        return null;
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const userData: StrapiUsersMeResponse = await response.json();
    return userData;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

/**
 * Enhanced fetch function with JWT authentication
 */
export const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle unauthorized errors (token expired)
    if (response.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }
      throw new Error("Authentication token expired");
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};
