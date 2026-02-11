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