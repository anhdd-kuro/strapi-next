/**
 * Types for Strapi API responses
 */

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
  blocks: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};
