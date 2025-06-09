import Image from "next/image";
import Link from "next/link";
import { fetchAPI } from "@/utils/api";
import type { Article, StrapiResponse } from "@/types/strapi";
import ArticleCard from "./components/ArticleCard";

/**
 * Get featured articles from Strapi for the homepage
 */
const getFeaturedArticles = async (): Promise<StrapiResponse<Article>> => {
  try {
    return await fetchAPI<StrapiResponse<Article>>("/articles", {
      "pagination[page]": "1",
      "pagination[pageSize]": "3",
      populate: "cover,category,author",
      sort: "publishedAt:desc",
    });
  } catch (error) {
    console.error("Failed to fetch featured articles:", error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 3, pageCount: 0, total: 0 } },
    };
  }
};

export default async function Home() {
  // Fetch the featured articles
  const featuredArticles = await getFeaturedArticles();

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Strapi Next.js Blog
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Discover the latest articles powered by Strapi CMS and Next.js
          </p>
          <Link
            href="/articles"
            className="inline-block bg-white text-blue-600 font-medium rounded-lg px-6 py-3 text-lg hover:bg-gray-100 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </section>

      {/* Featured articles section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Articles
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Check out our latest content from our blog
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.data.length > 0 ? (
              featuredArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article.attributes} />
              ))
            ) : (
              <div className="col-span-3 text-center py-16 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800">
                  No articles found
                </h3>
                <p className="mt-2 text-gray-600">
                  Start creating content in your Strapi dashboard
                </p>
              </div>
            )}
          </div>

          {featuredArticles.data.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/articles"
                className="inline-block border border-blue-600 text-blue-600 font-medium rounded-lg px-6 py-3 hover:bg-blue-600 hover:text-white transition-colors"
              >
                View All Articles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Strapi + Next.js?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              The perfect combination for modern web development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Next.js offers server-side rendering and static site generation
                for blazing fast page loads.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible CMS</h3>
              <p className="text-gray-600">
                Strapi gives you the freedom to structure your content exactly
                how you want it.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Developer Experience
              </h3>
              <p className="text-gray-600">
                TypeScript integration, hot reloading, and a modern stack for
                the best developer experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
