// Blogger API Integration

export interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  url: string;
  labels?: string[];
  images?: { url: string }[];
}

export interface BloggerResponse {
  items: BloggerPost[];
}

const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;

export const fetchBloggerPosts = async (): Promise<BloggerPost[]> => {
  if (!API_KEY || !BLOG_ID) {
    console.warn("Blogger API keys are missing. Please set VITE_BLOGGER_API_KEY and VITE_BLOGGER_BLOG_ID in your environment variables.");
    return [];
  }

  try {
    const response = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&fetchImages=true`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch posts from Blogger");
    }

    const data: BloggerResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Blogger posts:", error);
    return [];
  }
};
