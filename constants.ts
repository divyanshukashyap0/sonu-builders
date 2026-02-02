import {
  Building2,
  HardHat,
  Home,
  PaintBucket,
  Ruler,
  Key,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Project, ProjectCategory, Service, Testimonial, NavLink } from './types';

export const COMPANY_NAME = "Sonu Enterprises & Building Developers";
export const COMPANY_PHONE = "+91 9967044479";
export const COMPANY_EMAIL = "sonu15enterprises@gmail.com";
export const COMPANY_ADDRESS = "Shop no. 22, Chandresh Godavari, Kalyan - Shilphata Rd, near nilje station, Dombivali East, Palava City, Kalyan, Maharashtra 421204";

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Residential Construction',
    description: 'Custom home building with a focus on durability, aesthetics, and modern living standards.',
    icon: Home,
  },
  {
    id: '2',
    title: 'Commercial Development',
    description: 'State-of-the-art office spaces, retail complexes, and industrial buildings.',
    icon: Building2,
  },
  {
    id: '3',
    title: 'Project Planning',
    description: 'Comprehensive architectural planning, structural design, and government approvals.',
    icon: Ruler,
  },
  {
    id: '4',
    title: 'Renovation & Remodeling',
    description: 'Transforming existing structures with modern designs and improved functionality.',
    icon: PaintBucket,
  },
  {
    id: '5',
    title: 'Turnkey Solutions',
    description: 'End-to-end construction management from groundbreaking to final key handover.',
    icon: Key,
  },
  {
    id: '6',
    title: 'Real Estate Development',
    description: 'Developing sustainable housing societies and premium plotted developments.',
    icon: HardHat,
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Skyline Heights',
    location: 'Sector 45, Urban City',
    category: ProjectCategory.RESIDENTIAL,
    image: 'https://picsum.photos/id/122/800/600',
    description: 'A premium 12-story residential complex with modern amenities.',
    completionDate: '2023',
    gallery: [
      'https://picsum.photos/id/122/800/600',
      'https://picsum.photos/id/123/800/600',
      'https://picsum.photos/id/124/800/600'
    ]
  },
  {
    id: '2',
    title: 'TechHub Business Park',
    location: 'Cyber District',
    category: ProjectCategory.COMMERCIAL,
    image: 'https://picsum.photos/id/48/800/600',
    description: 'Grade A office spaces designed for IT and corporate firms.',
    completionDate: '2022',
    gallery: [
      'https://picsum.photos/id/48/800/600',
      'https://picsum.photos/id/49/800/600',
      'https://picsum.photos/id/50/800/600'
    ]
  },
  {
    id: '3',
    title: 'Green Valley Villas',
    location: 'Suburban Hills',
    category: ProjectCategory.ONGOING,
    image: 'https://picsum.photos/id/164/800/600',
    description: 'Luxury eco-friendly villas surrounded by nature.',
    completionDate: 'Dec 2024',
    gallery: [
      'https://picsum.photos/id/164/800/600',
      'https://picsum.photos/id/165/800/600',
      'https://picsum.photos/id/166/800/600'
    ]
  },
  {
    id: '4',
    title: 'The Grand Arcade',
    location: 'Main Market Road',
    category: ProjectCategory.UPCOMING,
    image: 'https://picsum.photos/id/221/800/600',
    description: 'A mix-use retail and entertainment complex.',
    gallery: [
      'https://picsum.photos/id/221/800/600',
      'https://picsum.photos/id/222/800/600'
    ]
  },
  {
    id: '5',
    title: 'Sunrise Apartments',
    location: 'East End',
    category: ProjectCategory.RESIDENTIAL,
    image: 'https://picsum.photos/id/193/800/600',
    description: 'Affordable luxury apartments for modern families.',
    completionDate: '2021',
    gallery: [
      'https://picsum.photos/id/193/800/600',
      'https://picsum.photos/id/194/800/600'
    ]
  },
  {
    id: '6',
    title: 'City Center Mall',
    location: 'Downtown',
    category: ProjectCategory.COMMERCIAL,
    image: 'https://picsum.photos/id/435/800/600',
    description: 'Renovation and expansion of the historic city mall.',
    completionDate: '2023',
    gallery: [
      'https://picsum.photos/id/435/800/600',
      'https://picsum.photos/id/436/800/600',
      'https://picsum.photos/id/437/800/600'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Home Owner',
    content: 'Sonu Enterprises delivered our dream home on time and within budget. The quality of materials used was exceptional.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Anita Desai',
    role: 'Property Investor',
    content: 'Professionalism and transparency are what define them. I have invested in two of their commercial projects.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Vikram Singh',
    role: 'Architect',
    content: 'As an architect, I appreciate their attention to detail and adherence to structural drawings. Great partners.',
    rating: 4,
  },
];

export const CONTACT_INFO = {
  phone: COMPANY_PHONE,
  email: COMPANY_EMAIL,
  address: COMPANY_ADDRESS,
  icons: {
    phone: Phone,
    email: Mail,
    address: MapPin
  }
};