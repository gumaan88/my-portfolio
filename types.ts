import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  description: string;
  image: string;
  stats?: { label: string; value: string }[];
}

export interface AISolution {
  title: string;
  description: string;
  impact: string;
  icon: LucideIcon;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
}

export interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: any; // Timestamp
  likes: number;
  dislikes: number;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  name: string;
  content: string;
  createdAt: any;
  isAdmin: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
  read: boolean;
}

export interface SiteRating {
  rating: number; // 1-5
  count: number;
}