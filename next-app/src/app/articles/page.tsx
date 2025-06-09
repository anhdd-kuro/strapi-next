import type { Article, StrapiResponse } from '@/types/strapi';
import { fetchAPI } from '@/utils/api';
import ArticleCard from '../components/ArticleCard';

/**
 * Fetch articles from Strapi with pagination and filtering
 */
const getArticles = async (
  page: number = 1,
  pageSize: number = 9,
): Promise<StrapiResponse<Article>> => {
  try {
    return await fetchAPI<StrapiResponse<Article>>('/articles', {
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString(),
      'populate': 'cover,category,author',
      'sort': 'publishedAt:desc',
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    // Return empty response to avoid breaking the UI
    return { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };
  }
};

/**
 * Articles listing page
 */
const ArticlesPage = async () => {
  // Fetch articles data from Strapi
  const articlesData = await getArticles();

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest Articles
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of articles and stay updated with the latest news and insights.
          </p>
        </div>

        {articlesData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesData.data.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article.attributes} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">No articles found</h2>
            <p className="mt-2 text-gray-600">
              Check back later for new content or try adjusting your filters.
            </p>
          </div>
        )}
        
        {/* Pagination placeholder - would be implemented fully in a real app */}
        {articlesData.meta.pagination.pageCount > 1 && (
          <div className="mt-12 flex justify-center">
            <p className="text-gray-600">
              Page {articlesData.meta.pagination.page} of {articlesData.meta.pagination.pageCount}
            </p>
            {/* Pagination buttons would go here */}
          </div>
        )}
      </div>
    </main>
  );
};

export default ArticlesPage;
