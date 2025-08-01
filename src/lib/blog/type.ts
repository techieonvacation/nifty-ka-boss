export interface Author {
  name: string;
  avatar?: string;
  role: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  image: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  category: string;
  readTime: number;
  featured: boolean;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  blogPostId: string;
  author: string;
  content: string;
  createdAt: string;
}
