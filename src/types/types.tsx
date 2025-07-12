export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface PostData {
  authorId: string;
  gameId: number;
  title: string;
  content: string;
  imageURL: string;
  rate: number;
}


