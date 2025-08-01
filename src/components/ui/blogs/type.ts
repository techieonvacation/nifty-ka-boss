export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  image: string;
  featured: boolean;
}
