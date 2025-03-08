export interface PostType {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  comments?: CommentType[];
}

export interface CommentType {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}