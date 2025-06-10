/**
 * @file Strapi specific type definitions
 */

// Generic Strapi Response Types (from existing file)
export type StrapiResponse<T> = {
  data: {
    id: number;
    attributes: T;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: {
    id: number;
    attributes: T;
  };
  meta: {};
};

// Article Type (from existing file)
export type Article = {
  title: string;
  description: string;
  slug: string;
  cover: {
    data: {
      id: number;
      attributes: {
        url: string;
        formats: {
          thumbnail: {
            url: string;
          };
        };
      };
    };
  };
  author: {
    data: {
      id: number;
      attributes: {
        name: string;
      };
    };
  };
  category: {
    data: {
      id: number;
      attributes: {
        name: string;
      };
    };
  };
  blocks: any[]; // Consider defining a more specific type for blocks if possible
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// New Types for Authentication
export type StrapiRole = {
  id: number;
  name: string;
  description: string;
  type: string;
};

export type StrapiUser = {
  id: number;
  username: string;
  email: string;
  provider: string; // e.g., 'local'
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role?: StrapiRole; // Role might not always be populated depending on the query
  // Add any custom fields like firstName, lastName if you add them to Strapi User content type
  // firstName?: string;
  // lastName?: string;
};

export type StrapiLoginResponse = {
  jwt: string;
  user: StrapiUser;
};

// This type aims to cover common Strapi error structures.
// Strapi's error response can vary, especially with custom error handling or plugins.
export type StrapiError = {
  data: null | { // Sometimes error details are nested under 'data'
    error?: { // Strapi v4 often uses this structure for validation errors or specific plugin errors
      status: number;
      name: string;
      message: string;
      details?: Record<string, unknown> | Array<Record<string, unknown>>;
    };
    message?: string; // For some errors, a direct message might be here
  };
  error: { // More common structure for general errors or from users-permissions plugin
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown> | Array<Record<string, unknown>>;
  };
};

export type StrapiUsersMeResponse = StrapiUser;
