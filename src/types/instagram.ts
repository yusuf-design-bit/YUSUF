export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified?: boolean;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  user: User;
  mediaUrls: string[];
  aspectRatio: 'square' | 'portrait' | 'landscape';
  caption: string;
  tags: string[];
  location?: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  comments: Comment[];
  createdAt: string;
  filterClass?: string;
  filterStyle?: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    sepia?: number;
    grayscale?: number;
  };
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  text?: string;
  createdAt: string;
}

export interface UserStory {
  user: User;
  hasUnseen: boolean;
  slides: StorySlide[];
}

export interface Reel {
  id: string;
  user: User;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  musicTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
  liked?: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  text?: string;
  targetPost?: {
    id: string;
    mediaUrl: string;
  };
  createdAt: string;
  isRead: boolean;
}

export type ActiveTab = 'home' | 'search' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile';

export interface FilterPreset {
  id: string;
  name: string;
  filterStyle: {
    brightness: number;
    contrast: number;
    saturate: number;
    sepia: number;
    grayscale: number;
  };
}
