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
    longDescription: 'Our full home interior service provides a comprehensive end-to-end solution for your living space. We believe that a home should be a reflection of your personality. Our team works closely with you to create a harmonious design language that flows through every room, from the foyer to the bedrooms.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    features: [
      'Personalized design consultations',
      '3D visualizations for all rooms',
      'Premium material sourcing',
      'Dedicated project management',
      'Professional installation'
    ],
    suggestions: [
      'Consider open-plan layouts for smaller homes to create a sense of space.',
      'Use a neutral color palette as a base and add pops of color through accessories.',
      'Invest in high-quality lighting to set the mood in different zones.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
    ]
  },
  {
    id: '2',
    title: 'Modular Kitchens',
    description: 'Ergonomic and stylish modular kitchens designed for modern cooking needs with maximum storage.',
    longDescription: 'A kitchen is the heart of the home. Our modular kitchen designs focus on the "Work Triangle" concept to maximize efficiency while ensuring a sleek, clutter-free aesthetic. We use high-quality hardware and water-resistant materials to ensure longevity and ease of maintenance.',
    icon: PaintBucket,
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
    features: [
      'Ergonomic layout planning (L-shaped, U-shaped, Island)',
      'Soft-close German hardware',
      'Waterproof BWP plywood cabinets',
      'Granite or Quartz countertops',
      'Integrated appliance housing'
    ],
    suggestions: [
      'Choose high-gloss finishes for small kitchens to reflect light.',
      'Incorporate pull-out pantry units for better accessibility.',
      'Opt for under-cabinet LED lighting for task-oriented illumination.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1556911223-e250e334621c?w=800&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ce?w=800&q=80',
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80'
    ]
  },
  {
    id: '3',
    title: 'Living Room Design',
    description: 'Creating luxurious and inviting living spaces with custom furniture, lighting, and decor.',
    longDescription: 'The living room is where you entertain and unwind. Our designs prioritize comfort without compromising on elegance. We focus on creating a centerpiece—be it a custom TV unit or a feature wall—that anchors the room and sets the tone for the rest of your home.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    features: [
      'Custom TV unit designs',
      'Statement wall treatments (Stone, Wood, Paint)',
      'Bespoke sofa and seating sets',
      'Smart home lighting integration',
      'Curated decor and art selection'
    ],
    suggestions: [
      'Use rugs to define seating areas in large rooms.',
      'Mix textures like velvet and wood to create a rich, layered feel.',
      'Keep the walk-paths clear to maintain an airy feel.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80'
    ]
  },
  {
    id: '4',
    title: 'Wardrobe & Storage',
    description: 'Customized wardrobes and smart storage solutions that blend functionality with aesthetics.',
    longDescription: 'Efficient storage is the key to a clutter-free life. Our wardrobe solutions are tailored to your storage needs, whether you prefer walk-in closets or sleek sliding wardrobes. We integrate smart accessories like pull-out racks and internal lighting to make organization effortless.',
    icon: Ruler,
    image: 'https://images.unsplash.com/photo-1558882224-cca162730191?w=800&q=80',
    features: [
      'Sliding or hinged door options',
      'Customized internal configurations',
      'Built-in sensor lighting',
      'Soft-close drawers and accessories',
      'Premium laminate or glass finishes'
    ],
    suggestions: [
      'Use floor-to-ceiling wardrobes to maximize vertical space.',
      'Incorporate mirror doors to make bedrooms feel larger.',
      'Add a dedicated jewelry or watch tray for better organization.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80',
      'https://images.unsplash.com/photo-1558882224-cca162730191?w=800&q=80'
    ]
  },
  {
    id: '5',
    title: 'False Ceiling & Lighting',
    description: 'Elegant false ceiling designs and ambient lighting solutions to enhance the mood of your home.',
    longDescription: 'Lighting can transform a space instantly. Our ceiling designs do more than just hide wiring; they become an architectural element of your home. We combine cove lighting, spotlights, and chandeliers to create a multi-layered lighting strategy that is both functional and dramatic.',
    icon: Key,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&q=80',
    features: [
      'Gypsum or PVC false ceilings',
      'Cove lighting and backlighting',
      'Magnetic track lighting systems',
      'Chandelier and pendant installation',
      'Smart lighting controls'
    ],
    suggestions: [
      'Use perimeter cove lighting to make ceilings appear higher.',
      'Cool white light is best for kitchens; warm yellow for bedrooms.',
      'Combine multiple light sources to create depth and eliminate shadows.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
      'https://images.unsplash.com/photo-1560184897-62429407db3a?w=800&q=80',
      'https://images.unsplash.com/photo-1518739144896-74895624bf7c?w=800&q=80'
    ]
  },
  {
    id: '6',
    title: 'Bathroom Renovations',
    description: 'Modern bathroom designs with premium fittings, tiling, and space-saving layouts.',
    longDescription: 'Turn your bathroom into a personal spa. Our renovation services focus on waterproofing, smart plumbing, and the latest trends in vanity design and tile selection. We ensure that even small bathrooms feel spacious and opulent through clever design and high-quality finishes.',
    icon: HardHat,
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521477?w=800&q=80',
    features: [
      'Complete waterproofing treatment',
      'Premium sanitary ware installation',
      'Custom vanity and mirror cabinets',
      'Modern tile and stone cladding',
      'Shower glass partitions'
    ],
    suggestions: [
      'Use large tiles to minimize grout lines for a cleaner look.',
      'Wall-hung vanities create more visual floor space.',
      'Incorporate a niche in the shower area for organized storage.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80'
    ]
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
