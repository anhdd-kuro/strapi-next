import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/types/strapi';
import { API_URL } from '@/utils/api';

type ArticleCardProps = {
  article: Article;
};

/**
 * ArticleCard component for displaying article preview
 */
const ArticleCard = ({ article }: ArticleCardProps) => {
  // Create proper image URL from Strapi
  const imageUrl = article.cover?.data
    ? `${API_URL}${article.cover.data.attributes.url}`
    : '/placeholder-image.jpg';

  // Format date in a readable way
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <span className="text-sm text-blue-600 font-semibold">
            {article.category?.data?.attributes?.name || 'Uncategorized'}
          </span>
          <h2 className="mt-2 text-xl font-bold">
            <Link 
              href={`/articles/${article.slug}`}
              className="text-gray-900 hover:text-blue-600 transition-colors"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-2 text-gray-600 line-clamp-2">{article.description}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {formattedDate}
          </div>
          {article.author?.data && (
            <div className="text-sm text-gray-600">
              By {article.author.data.attributes.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
