export enum ProjectCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  INTERIOR = 'Interior',
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
  icon: any; // Using any for Lucide icon component type for simplicity
}

export interface NavLink {
  label: string;
  path: string;
}