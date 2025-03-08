export interface PostType {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentType {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}