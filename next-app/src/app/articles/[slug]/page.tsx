import Image from 'next/image';
import Link from 'next/link';
import type { Article, StrapiSingleResponse } from '@/types/strapi';
import { API_URL, fetchAPI } from '@/utils/api';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

/**
 * Get a single article by slug
 */
const getArticleBySlug = async (slug: string): Promise<StrapiSingleResponse<Article> | null> => {
  try {
    return await fetchAPI<StrapiSingleResponse<Article>>('/articles', {
      'filters[slug][$eq]': slug,
      'populate': 'cover,category,author,blocks',
    });
  } catch (error) {
    console.error(`Failed to fetch article with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Single Article Page
 */
const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = params;
  const articleData = await getArticleBySlug(slug);
  
  // If article not found, show error state
  if (!articleData || !articleData.data) {
    return (
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900">Article Not Found</h1>
          <p className="mt-4 text-lg text-gray-600">
            The article you're looking for couldn't be found or has been removed.
          </p>
          <div className="mt-8">
            <Link 
              href="/articles"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Articles
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const article = articleData.data.attributes;
  
  // Format date in a readable way
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Create proper image URL from Strapi
  const coverImageUrl = article.cover?.data
    ? `${API_URL}${article.cover.data.attributes.url}`
    : '/placeholder-image.jpg';

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/articles" className="hover:text-blue-600">Articles</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="truncate max-w-[200px]">
              <span className="text-gray-800">{article.title}</span>
            </li>
          </ol>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            {article.category?.data && (
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                {article.category.data.attributes.name}
              </span>
            )}
            <time className="text-sm text-gray-500">{formattedDate}</time>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600">
            {article.description}
          </p>
          {article.author?.data && (
            <div className="mt-6 flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  By {article.author.data.attributes.name}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Cover image */}
        {article.cover?.data && (
          <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Article content - In a real app, you would render dynamic blocks here */}
        <div className="prose prose-lg max-w-none">
          <p>This is where you would render the dynamic content blocks from Strapi.</p>
          <p>For a complete implementation, you would need to create components for each block type
          (rich text, media, quote, slider, etc.) and render them based on the block type.</p>
        </div>

        {/* Back to articles button */}
        <div className="mt-12 text-center">
          <Link 
            href="/articles"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ArticlePage;
