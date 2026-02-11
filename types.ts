import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id?: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  iconName: string; // Changed from icon to iconName for DB storage
  tags: string[];
}

export interface Project {
  id?: string;
  title: string; // Keep simple for projects or upgrade to object if needed. Keeping simple based on previous code.
  category: string;
  description: string;
  image: string;
  stats?: { label: string; value: string }[];
}

export interface AISolution {
  id?: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  impact: { ar: string; en: string };
  iconName: string;
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
  createdAt: any; 
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
  rating: number; 
  count: number;
}

// New Types for Section Content
export interface HeroContent {
  titlePart1: { ar: string; en: string };
  titleHighlight: { ar: string; en: string };
  titlePart2: { ar: string; en: string };
  description: { ar: string; en: string };
  status: { ar: string; en: string };
  image: string;
  // Badges
  badge1Title?: { ar: string; en: string };
  badge1Sub?: { ar: string; en: string };
  badge2Title?: { ar: string; en: string };
  badge2Sub?: { ar: string; en: string };
  badge3Title?: { ar: string; en: string };
  badge3Sub?: { ar: string; en: string };
}

export interface CommunityRole {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  iconName: string;
}

export interface CommunityContent {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  roles: CommunityRole[];
}