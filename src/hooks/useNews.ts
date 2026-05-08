import { useState, useEffect } from 'react';
import { fetchBloggerPosts, BloggerPost } from '../services/bloggerService';
import { FALLBACK_NEWS_ARTICLES, NewsArticle } from '../data/newsData';

// Function to convert a BloggerPost to a NewsArticle
const mapBloggerPost = (post: BloggerPost): NewsArticle => {
  // Try to find the first image or use a default one
  let image = 'https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?auto=format&fit=crop&q=80&w=800';
  
  if (post.images && post.images.length > 0) {
    image = post.images[0].url;
  } else {
    // Attempt to extract an image from the content HTML
    const imgMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      image = imgMatch[1];
    }
  }

  // Very basic excerpt creation: strip HTML and take first 100 chars
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = post.content;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  const excerpt = textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;

  const dateObject = new Date(post.published);
  const dateFormatted = `${dateObject.getDate() < 10 ? '0' : ''}${dateObject.getDate()} Thg ${dateObject.getMonth() + 1}, ${dateObject.getFullYear()}`;

  return {
    id: post.id,
    title: post.title,
    excerpt: excerpt,
    content: post.content, // Blogger returns HTML
    image: image,
    date: dateFormatted,
    category: post.labels && post.labels.length > 0 ? post.labels[0] : 'Blog',
    isHtml: true, // we need to know if we should render as HTML or Markdown
  };
};

export const useNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(FALLBACK_NEWS_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const posts = await fetchBloggerPosts();
        if (posts) {
          if (posts.length > 0) {
            const mappedPosts = posts.map(mapBloggerPost);
            setArticles(mappedPosts);
          } else {
            // Successfully connected but no posts found
            setArticles([]);
          }
        }
      } catch (error) {
        console.error("Failed to load from Blogger, falling back to static data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  return { articles, isLoading };
};
