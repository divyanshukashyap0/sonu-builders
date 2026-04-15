export enum ProjectCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  LUXURY = 'Luxury Interiors',
  TRADITIONAL = 'Traditional Style',
  ONGOING = 'Ongoing Projects',
  UPCOMING = 'Upcoming Projects'
}

export interface Project {
  id: string;
  title: string;
  location: string;
  category: ProjectCategory;
  image: string;
  description: string;
  completionDate?: string;
  gallery?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: any;
  image?: string;
  features?: string[];
  suggestions?: string[];
  gallery?: string[];
}

export interface NavLink {
  label: string;
  path: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title?: string;
  category?: string;
  createdAt?: number;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget?: string;
  status: LeadStatus;
  createdAt: any; // Firestore Timestamp or Date
  notes?: string;
  source?: string;
}
export interface ChatInquiry {
  id: string;
  name: string;
  phone: string;
  problem: string;
  createdAt: any; // Firestore Timestamp or Date
  status: 'New' | 'Responded' | 'Archived';
}
export interface RoomEstimate {
  name: string;
  area: number;
  level: 'basic' | 'premium' | 'luxury';
}

export interface ProjectEstimate {
  id: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  city?: string;
  timeline: string;
  rooms: RoomEstimate[];
  totalBudget: number;
  status: 'New' | 'Quote Sent' | 'Followed Up';
  createdAt: any;
}
