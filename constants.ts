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

export const COMPANY_NAME = "Sonu Interiors & Home Design";
export const COMPANY_PHONE = "+91 9967044479";
export const COMPANY_EMAIL = "sonu15enterprises@gmail.com";
export const COMPANY_ADDRESS = "Shop no. 22, Chandresh Godavari, Kalyan - Shilphata Rd, near nilje station, Dombivali East, Palava City, Kalyan, Maharashtra 421204";

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Full Home Interiors',
    description: 'Transforming your entire home with cohesive design themes, smart space planning, and premium finishes.',
    icon: Home,
  },
  {
    id: '2',
    title: 'Modular Kitchens',
    description: 'Ergonomic and stylish modular kitchens designed for modern cooking needs with maximum storage.',
    icon: PaintBucket,
  },
  {
    id: '3',
    title: 'Living Room Design',
    description: 'Creating luxurious and inviting living spaces with custom furniture, lighting, and decor.',
    icon: Building2,
  },
  {
    id: '4',
    title: 'Wardrobe & Storage',
    description: 'Customized wardrobes and smart storage solutions that blend functionality with aesthetics.',
    icon: Ruler,
  },
  {
    id: '5',
    title: 'False Ceiling & Lighting',
    description: 'Elegant false ceiling designs and ambient lighting solutions to enhance the mood of your home.',
    icon: Key,
  },
  {
    id: '6',
    title: 'Bathroom Renovations',
    description: 'Modern bathroom designs with premium fittings, tiling, and space-saving layouts.',
    icon: HardHat,
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Minimalist Apartment',
    location: 'Palava City, Kalyan',
    category: ProjectCategory.RESIDENTIAL,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    description: 'Complete 3BHK interior makeover with minimalist design theme, custom modular kitchen, and smart storage solutions.',
    completionDate: '2023',
    gallery: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800'
    ]
  },
  {
    id: '2',
    title: 'Luxury Penthouse Design',
    location: 'Thane West',
    category: ProjectCategory.LUXURY,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
    description: 'High-end penthouse interiors featuring Italian marble, designer lighting, and bespoke furniture.',
    completionDate: '2022',
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ]
  },
  {
    id: '3',
    title: 'Contemporary Villa Interiors',
    location: 'Dombivli',
    category: ProjectCategory.ONGOING,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    description: 'Complete villa interior design with modern aesthetics, false ceiling, and landscape integration.',
    completionDate: 'Dec 2024',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
      'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800'
    ]
  },
  {
    id: '4',
    title: 'Boutique Office Interior',
    location: 'Navi Mumbai',
    category: ProjectCategory.COMMERCIAL,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    description: 'Creative workspace design with ergonomic furniture, acoustic panels, and vibrant color schemes.',
    completionDate: '2023',
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ]
  },
  {
    id: '5',
    title: 'Cozy Studio Apartment',
    location: 'Mumbai',
    category: ProjectCategory.RESIDENTIAL,
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800',
    description: 'Space-optimized studio design with multi-functional furniture and warm color tones.',
    completionDate: '2024',
    gallery: [
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800'
    ]
  },
  {
    id: '6',
    title: 'Traditional Indian Home',
    location: 'Kalyan',
    category: ProjectCategory.TRADITIONAL,
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
    description: 'Classic Indian interior design with ethnic patterns, wooden furniture, and traditional decor elements.',
    completionDate: '2023',
    gallery: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Home Owner',
    content: 'Sonu Interiors transformed our 3BHK into a dream home! The modular kitchen is beautiful and functional. Highly recommend!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Amit Patel',
    role: 'Apartment Owner',
    content: 'Professional team with great design sense. They understood our vision and delivered exactly what we wanted. The false ceiling work is exceptional.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Neha Deshmukh',
    role: 'Villa Owner',
    content: 'From custom wardrobes to living room design, everything was executed perfectly. Great quality and on-time delivery!',
    rating: 5,
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
