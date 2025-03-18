export interface Post {
  id: string;
  title: string;
  content: string;
  owner: string;
  createdAt: string;
  updatedAt?: string;
  ownerProfileImage?: string;
}
