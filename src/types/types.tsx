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

export interface LikeData {
  userId: string;
  postId: string;
}

export interface CommentData {
  userId: string;
  postId: string;
  content: string;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  receiverId: string;
  senderId: string;
  type: 'Like';
  redirect: string;
  createdAt: string;
  read: boolean;
}
