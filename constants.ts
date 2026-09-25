import {
  Building2,
  HardHat,
  Home,
  PaintBucket,
  Ruler,
  Key,
  Phone,
  Mail,
  MapPin,
  Bed,
  Tv,
  Sun,
  Flame,
  Utensils,
  Briefcase,
  Layers,
  Sparkles,
  Wine,
  Grid
} from 'lucide-react';
import { Project, ProjectCategory, Service, Testimonial, NavLink, MumbaiLocation, BlogPost } from './types';

export const COMPANY_NAME = "Sonu Enterprises – Interior Construction & Design";
export const COMPANY_SHORT_NAME = "Sonu Enterprises";
export const COMPANY_PHONE = "+91 9967044479";
export const COMPANY_EMAIL = "sonu15enterprises@gmail.com";
export const COMPANY_ADDRESS = "Shop no. 22, Chandresh Godavari, Kalyan - Shilphata Rd, near nilje station, Dombivali East, Palava City, Kalyan, Maharashtra 421204";
export const COMPANY_FOUNDING_YEAR = 2009;
export const COMPANY_EXPERIENCE_YEARS = 15;
export const CANONICAL_DOMAIN = "https://sonu-builders.in";

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'Mumbai Interior', path: '/interior-designer-mumbai' },
  { label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

// ==========================================
// 12 REAL ADMIN SERVICES (Matched to Firestore DB)
// ==========================================
export const REAL_ADMIN_SERVICES: Service[] = [
  {
    id: 'nkA8BfdEByG4cMtEEmjd',
    slug: 'nkA8BfdEByG4cMtEEmjd',
    title: 'Full Home Interiors',
    h1: 'Full Home Interiors & Turnkey Fit-Outs in Mumbai',
    seoTitle: 'Full Home Interior Designers in Mumbai | Turnkey Flats & Villas | Sonu Enterprises',
    metaDescription: 'Complete turnkey interior solutions for your luxury home. Bespoke 1BHK, 2BHK, 3BHK flats and penthouses across Mumbai MMR with 10-year warranty.',
    categoryGroup: 'Primary',
    description: 'Complete turnkey interior solutions for your luxury home.',
    longDescription: 'End-to-end interior design and execution for complete flats, villas, and penthouses in Mumbai. From civil structural modifications and electrical planning to custom Italian marble flooring, bespoke carpentry, and designer lighting.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80'
    ],
    features: ['Turnkey Civil & Structural Work', 'End-to-End Project Management', 'Bespoke Factory Woodwork', '10-Year Structural Warranty']
  },
  {
    id: 'xeaiaNnqaTi5VubgdH6p',
    slug: 'xeaiaNnqaTi5VubgdH6p',
    title: 'Living Room',
    h1: 'Modern Luxury Living Room Interior Design in Mumbai',
    seoTitle: 'Living Room Interior Designers Mumbai | Modern Lounges & TV Units | Sonu Enterprises',
    metaDescription: 'Modern, elegant, and functional living room solutions designed with premium materials, smart layouts, and timeless aesthetics for comfortable everyday living.',
    categoryGroup: 'Room Interior',
    description: 'Modern, elegant, and functional living room solutions designed with premium materials, smart layouts, and timeless aesthetics for comfortable everyday living.',
    longDescription: 'Statement living rooms featuring floating TV consoles, acoustic panelling, Italian marble feature walls, bespoke seating layouts, and architectural layered lighting.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80'
    ],
    features: ['Italian Marble Feature Walls', 'Concealed Wire Management', 'Acoustic Wall Panelling', 'Custom Designer Furniture']
  },
  {
    id: 'Ac8MqotINXRfHOswA5Fi',
    slug: 'Ac8MqotINXRfHOswA5Fi',
    title: 'Modular Kitchens',
    h1: 'Luxury Modular Kitchen Design & Manufacturing in Mumbai',
    seoTitle: 'Modular Kitchen Manufacturers Mumbai | German Hardware & BWP Ply | Sonu Enterprises',
    metaDescription: 'Ergonomic and stylish modular kitchen designs. Precision factory joinery with 100% BWP Marine Ply, Blum & Hettich fittings, and seamless quartz countertops.',
    categoryGroup: 'Primary',
    description: 'Ergonomic and stylish modular kitchen designs.',
    longDescription: 'Precision-crafted modular kitchens built with 100% IS:710 Marine Grade BWP Plywood, German soft-close tandem hardware (Blum/Hettich), quartz countertops, and ergonomic storage zoning.',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'
    ],
    features: ['IS:710 Marine Grade BWP Plywood', 'Blum & Hettich German Hardware', 'Seamless Quartz Countertops', 'Anti-Cockroach & Termite Proof']
  },
  {
    id: '4kPKePlWMuK7ldC6FRvg',
    slug: '4kPKePlWMuK7ldC6FRvg',
    title: 'Bedroom',
    h1: 'Master & Guest Bedroom Interior Design in Mumbai',
    seoTitle: 'Bedroom Interior Designers Mumbai | Luxury Master Suites | Sonu Enterprises',
    metaDescription: 'Comfortable and stylish bedroom design for relaxation and privacy. Custom upholstered headboards, acoustic walls, and warm ambient lighting.',
    categoryGroup: 'Room Interior',
    description: 'Comfortable and stylish bedroom design for relaxation and privacy.',
    longDescription: 'Serene master bedroom and guest bedroom sanctuaries featuring custom upholstered headboards, acoustic wall panelling, integrated bedside floating drawers, and warm ambient backlighting.',
    icon: Bed,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?w=1200&q=80'
    ],
    features: ['Bespoke Upholstered Headboards', 'Integrated Ambient Backlighting', 'Acoustic Wall Panelling', 'Concealed Storage Beds']
  },
  {
    id: 'C1hqFPJvYJErbRrCWSP2',
    slug: 'C1hqFPJvYJErbRrCWSP2',
    title: 'Wardrobe & Storage',
    h1: 'Custom Wardrobes & Walk-In Closets in Mumbai',
    seoTitle: 'Custom Wardrobes & Walk-in Closets Mumbai | Modular Storage | Sonu Enterprises',
    metaDescription: 'Custom storage solutions and walk-in closets. Floor-to-ceiling wardrobes, sliding mirror doors, and modular organizers designed for Mumbai homes.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Custom storage solutions and walk-in closets.',
    longDescription: 'Floor-to-ceiling custom wardrobes, sliding mirror doors, tinted glass walk-in closets, and modular internal organizers engineered to maximize Mumbai flat vertical height.',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80'
    ],
    features: ['Floor-to-Ceiling Max Storage', 'Tinted Glass & Profile Doors', 'Sensor LED Wardrobe Lighting', 'Velvet-Lined Jewelry Trays']
  },
  {
    id: '7A1pI6VlZnFXcUjepOQh',
    slug: '7A1pI6VlZnFXcUjepOQh',
    title: 'TV Unit',
    h1: 'Designer TV Units & Entertainment Consoles in Mumbai',
    seoTitle: 'Modern TV Unit Designers Mumbai | Floating Wall Consoles | Sonu Enterprises',
    metaDescription: 'Stylish and functional TV unit design with smart storage. Fluted wooden louvers, backlit marble slabs, and concealed wire raceways.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Stylish and functional TV unit design with smart storage.',
    longDescription: 'Contemporary media consoles and TV entertainment walls featuring fluted wooden louvers, backlit marble slabs, floating storage ledges, and concealed raceways for a completely wire-free look.',
    icon: Tv,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80'
    ],
    features: ['Concealed Cable Raceways', 'Backlit Fluted Louver Panels', 'Floating Storage Drawers', 'Integrated Soundbar Shelving']
  },
  {
    id: 'MtDfVzfvhKaW6LKt6hRO',
    slug: 'MtDfVzfvhKaW6LKt6hRO',
    title: 'Dining Area',
    h1: 'Luxury Dining Room Interior Design in Mumbai',
    seoTitle: 'Dining Area Interior Designers Mumbai | Marble Dining Tables & Bars | Sonu Enterprises',
    metaDescription: 'Well-planned dining area for comfortable family meals. Custom marble tables, designer crockery cabinets, and ambient statement lighting.',
    categoryGroup: 'Room Interior',
    description: 'Well-planned dining area for comfortable family meals.',
    longDescription: 'Elegant dining spaces with custom marble-top dining tables, bespoke upholstered chairs, designer statement chandeliers, and integrated bar or crockery display cabinets.',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    features: ['Custom Marble Dining Tables', 'Designer Glass Crockery Cabinets', 'Statement Pendant Lighting', 'Space-Saving Bench Seating']
  },
  {
    id: 'RN0yIGxqConWtyN0b4ub',
    slug: 'RN0yIGxqConWtyN0b4ub',
    title: 'False Ceiling',
    h1: 'False Ceiling & Architectural Lighting in Mumbai',
    seoTitle: 'False Ceiling Contractors Mumbai | Gyproc Cove Lighting | Sonu Enterprises',
    metaDescription: 'Premium false ceiling and specialized lighting. Gyproc Saint-Gobain certified cove perimeter lighting and magnetic track lights.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Premium false ceiling and specialized lighting.',
    longDescription: 'Gyproc Saint-Gobain false ceilings, cove perimeter lighting, magnetic track lights, and acoustic wooden rafter drops that add depth and sophistication without compromising ceiling clearance.',
    icon: Grid,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    features: ['Gyproc Saint-Gobain Certified', 'Indirect Ambient Cove Lighting', 'Architectural Magnetic Track Lights', 'Zero-Crack Surface Finish']
  },
  {
    id: 'gTWiloDHy4uWBTYOfkIZ',
    slug: 'gTWiloDHy4uWBTYOfkIZ',
    title: 'Bathroom Interiors',
    h1: 'Luxury Bathroom Renovation & Interiors in Mumbai',
    seoTitle: 'Bathroom Interior Designers Mumbai | Modern Renovation & Vanities | Sonu Enterprises',
    metaDescription: 'Modern and functional bathroom renovations. Large format anti-skid porcelain tiles, glass shower enclosures, and Grohe/Kohler fixtures.',
    categoryGroup: 'Room Interior',
    description: 'Modern and functional bathroom renovations.',
    longDescription: 'Spa-inspired luxury bathroom renovations featuring large-format anti-skid porcelain tiles, frameless toughened glass shower enclosures, wall-hung vanities, and concealed Grohe/Kohler plumbing.',
    icon: PaintBucket,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80'
    ],
    features: ['Frameless Glass Shower Partitions', 'Concealed Diverters (Grohe/Kohler)', 'Floating Vanities with Quartz Tops', 'Anti-Skid Vitrified Tiling']
  },
  {
    id: 'OHpbY2sSrenghqq6noCl',
    slug: 'OHpbY2sSrenghqq6noCl',
    title: 'Study Table',
    h1: 'Ergonomic Study Tables & Home Office Design in Mumbai',
    seoTitle: 'Study Table & Home Office Designers Mumbai | Work from Home | Sonu Enterprises',
    metaDescription: 'Smart study table design for productivity and organization. Ergonomic desks, floating bookshelves, and integrated cable raceways.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Smart study table design for productivity and organization.',
    longDescription: 'Ergonomic work-from-home and student study setups with integrated wire raceways, floating overhead bookshelves, magnetic pin boards, and comfortable task lighting.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
    ],
    features: ['Ergonomic Desk Heights', 'Overhead Floating Bookshelves', 'Integrated Wire Management', 'Task LED Desk Lighting']
  },
  {
    id: 'YeBmKWsqzqlZaldUzSCN',
    slug: 'YeBmKWsqzqlZaldUzSCN',
    title: 'Balcony',
    h1: 'Balcony Makeovers & Outdoor Lounge Design in Mumbai',
    seoTitle: 'Balcony Interior Designers Mumbai | Composite Decking & Green Walls | Sonu Enterprises',
    metaDescription: 'Relaxing balcony setup for comfort and fresh ambiance. Weatherproof composite decking, vertical garden walls, and outdoor ambient lighting.',
    categoryGroup: 'Room Interior',
    description: 'Relaxing balcony setup for comfort and fresh ambiance.',
    longDescription: 'Weatherproof balcony sit-outs with wooden-finish composite decking, vertical green artificial grass walls, weather-resistant seating, and cozy exterior warm lighting.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    features: ['Weatherproof Composite Decking', 'Vertical Green Plant Walls', 'All-Weather Exterior Furniture', 'Ambient Waterproof Lighting']
  },
  {
    id: 'mx4QtVSG09wOe79cxT4s',
    slug: 'mx4QtVSG09wOe79cxT4s',
    title: 'Temple',
    h1: 'Sacred Home Mandir & Pooja Room Design in Mumbai',
    seoTitle: 'Home Temple & Mandir Designers Mumbai | CNC Jali & Brass Details | Sonu Enterprises',
    metaDescription: 'Peaceful and beautifully designed home temple area. CNC lattice work, brass accents, backlit Corian, and Vastu-compliant layouts.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Peaceful and beautifully designed home temple area.',
    longDescription: 'Sacred home Mandir sanctuaries incorporating traditional CNC jali lattice work, Corian and brass detailing, warm concealed backlight bells, and dedicated storage for pooja samagri.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1545048702-7936070012f7?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545048702-7936070012f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
    ],
    features: ['Custom CNC Jali & Brass Bells', 'Translucent Corian Backlit Walls', 'Pooja Samagri Pullout Drawers', 'Vastu-Compliant Spatial Planning']
  }
];

export const SERVICES: Service[] = [
  // 1. Residential Interior Design
  {
    id: 'residential-interior-design',
    slug: 'residential-interior-design',
    title: 'Residential Interior Design',
    h1: 'Turnkey Residential Interior Design in Mumbai',
    seoTitle: 'Residential Interior Designer in Mumbai | Turnkey Flats & Villas | Sonu Enterprises',
    metaDescription: 'Complete residential interior design for 1BHK, 2BHK, 3BHK flats and penthouses across Mumbai, Thane, and Kalyan-Dombivli. 3D visuals, guaranteed timelines & premium finishes.',
    categoryGroup: 'Primary',
    description: 'Turnkey residential interiors tailored for modern Mumbai high-rises, boutique apartments, and sprawling villas.',
    longDescription: 'Our turnkey residential interior service transforms raw flats into impeccably finished homes. We specialize in Mumbai apartment dynamics—maximizing square footage through intelligent floor plans, concealed storage, bespoke carpentry, architectural lighting, and premium acoustic treatments. From initial 3D visualization and society NOC coordination to on-site civil works, electrical, plumbing, carpentry, and final deep cleaning, our in-house master craftsmen oversee every square inch.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    features: [
      'Comprehensive 2D working drawings & photorealistic 3D renders',
      'Society NOC paperwork, security guidelines & working hour compliance',
      'Civil modifications, false ceiling, concealed wiring, and plumbing',
      'Factory-finished modular joinery using IS:710 Marine Ply',
      'End-to-end turnkey project management with milestone tracking'
    ],
    suggestions: [
      'Choose warm neutral palettes (taupe, warm grey, cream) to enhance spatial perception in compact urban flats.',
      'Incorporate wall-hung storage and floating consoles to preserve continuous floor sightlines.',
      'Invest in high-CRI (Color Rendering Index) recessed LED lighting to render true furniture textures.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    layouts: [
      { name: '1BHK & 2BHK Space Optimizer', description: 'Open-concept living-dining with collapsible sliding partitions and integrated dual-function joinery.' },
      { name: '3BHK & 4BHK Luxury Family Suite', description: 'Zoned privacy layouts with dedicated foyer, expansive master suites, and bespoke entertainment centers.' },
      { name: 'Duplex & Penthouse Grandeur', description: 'Double-height feature walls, architectural staircases, and seamless indoor-outdoor balcony flow.' }
    ],
    materials: ['IS:710 BWP Marine Plywood', 'CenturyPly / Greenlam laminates', 'Imported Italian Marble (Bottochino, Statuario)', 'Veneer with PU matte finish'],
    finishes: ['Matte & Satin Acrylic', 'Natural Wood Veneer', 'Brushed Brass metal accents', 'Anti-fingerprint soft-touch surfaces'],
    hardwareAndLighting: ['Blum soft-close drawer runners', 'Hettich Sensys hinges', 'Philips warm-white 3000K recessed COB spotlights', 'Magnetic track lighting'],
    processSteps: [
      { step: '01', title: 'Site Inspection & Spatial Audit', desc: 'Detailed laser measurement of your flat, structural column inspection, and client lifestyle briefing.' },
      { step: '02', title: '3D Visuals & Material Board', desc: 'Creation of 3D walkthroughs, mood boards, hardware selection, and transparent quotation.' },
      { step: '03', title: 'Society Approvals & Civil Work', desc: 'Managing society permissions, debris disposal permits, electrical conduit routing, and plumbing.' },
      { step: '04', title: 'Carpentry & Modular Assembly', desc: 'Precision carcass fabrication, edge-banding, laminate pressing, and hardware fitting.' },
      { step: '05', title: 'Quality Inspection & Handover', desc: '120-point quality audit, deep cleaning, snag-list resolution, and warranty documentation handover.' }
    ],
    faqs: [
      { question: 'What is the standard timeline for a 2BHK interior project in Mumbai?', answer: 'A typical 2BHK turnkey interior project takes between 45 to 60 working days, factoring in society work timing restrictions (typically 10 AM to 6 PM, Monday to Saturday).' },
      { question: 'Do you handle housing society NOCs and working permissions?', answer: 'Yes. We prepare the structural layout submission, contractor indemnity bonds, and coordinate directly with society management for gate passes and debris disposal.' },
      { question: 'Can we live in the flat while interior work is ongoing?', answer: 'For full home turnkey transformations involving false ceilings, tiling, and spray painting, we strongly recommend having the premises vacant to ensure swift execution and high-quality finishes.' }
    ]
  },

  // 2. Commercial Interior Design
  {
    id: 'commercial-interior-design',
    slug: 'commercial-interior-design',
    title: 'Commercial Interior Design',
    h1: 'Commercial & Office Interior Design in Mumbai',
    seoTitle: 'Commercial Interior Designers Mumbai | Corporate Offices & Retail | Sonu Enterprises',
    metaDescription: 'High-performance commercial interior design in Mumbai & Navi Mumbai. Modern corporate offices, executive suites, retail showrooms & boutique clinics designed for productivity.',
    categoryGroup: 'Primary',
    description: 'Strategic commercial interiors designed for employee productivity, brand authority, and optimal footfall.',
    longDescription: 'In Mumbai commercial hubs like BKC, Lower Parel, Andheri East, and Navi Mumbai, corporate spaces must balance brand prestige with stringent functional ergonomics. Sonu Enterprises delivers end-to-end commercial fit-outs, including acoustic glass partitioning, HVAC zoning, fire-compliant materials, structured network cabling, and biophilic executive boardrooms. We adhere strictly to commercial lease guidelines and fast-track delivery milestones to minimize business downtime.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    features: [
      'Fire-rated drywall partitions & acoustic glass meeting pods',
      'HVAC distribution & commercial electrical load balancing',
      'Custom reception counters & brand signature feature walls',
      'Ergonomic workstation setups with concealed cable raceways',
      'Adherence to National Building Code (NBC) safety guidelines'
    ],
    suggestions: [
      'Adopt flexible modular desking to facilitate future organizational expansion without civil re-work.',
      'Deploy double-glazed acoustic partitions around conference rooms to preserve privacy.',
      'Use 4000K neutral white lighting in working zones to minimize eye strain and boost alertness.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80'
    ],
    layouts: [
      { name: 'Agile Open Plan', description: 'Hot-desking zones paired with focus booths and breakout collaboration lounges.' },
      { name: 'Executive Suite & Boardroom', description: 'Sound-insulated cabins with leatherette wall panels and integrated video-conferencing joinery.' },
      { name: 'Retail & Experience Center', description: 'Customer flow-optimized merchandise displays with directional spotlighting and billing pods.' }
    ],
    materials: ['Saint-Gobain Acoustic Glass', 'Armstrong Mineral Fiber Ceiling Tiles', 'Commercial Grade Carpet Tiles', 'Fire-Retardant MDF / Plywood'],
    finishes: ['Powder-coated aluminum profiles', 'Textured acoustic felt', 'Industrial concrete laminate', 'Brushed steel'],
    hardwareAndLighting: ['Dorma glass door patch fittings', 'DALI dimmable LED commercial troffers', 'Linear architectural pendant extrusions'],
    processSteps: [
      { step: '01', title: 'Workplace Density Analysis', desc: 'Analyzing headcount, departmental workflow, server room requirements, and fire exit paths.' },
      { step: '02', title: 'MEP & Structural Engineering', desc: 'Coordinated drawings for HVAC ducts, sprinkler lines, electrical conduits, and server racks.' },
      { step: '03', title: 'Fast-Track Fit-Out Execution', desc: 'Parallel execution of glass partitions, ceiling grid, flooring, and joinery under strict safety protocols.' },
      { step: '04', title: 'Testing, Commissioning & Handover', desc: 'Network continuity testing, lux level verification, fire safety sign-off, and facility handover.' }
    ],
    faqs: [
      { question: 'Do you execute commercial projects during nights or weekends to avoid business disruption?', answer: 'Yes. In commercial office complexes and malls across Mumbai, our crews are deployed for overnight shifts and weekend installations to comply with building management policies.' },
      { question: 'Are materials used in commercial interiors certified for fire safety?', answer: 'We use fire-rated glass partitions, Class-1 fire retardant ceiling panels, and low-smoke zero-halogen (FRLS) wiring as required by Mumbai fire safety norms.' }
    ]
  },

  // 3. Modular Kitchen Design
  {
    id: 'modular-kitchen-design',
    slug: 'modular-kitchen-design',
    title: 'Modular Kitchen Design',
    h1: 'Bespoke Modular Kitchens in Mumbai & Kalyan-Dombivli',
    seoTitle: 'Modular Kitchen Design Mumbai | Waterproof BWP Cabinets & Quartz Tops | Sonu Enterprises',
    metaDescription: 'Custom modular kitchens engineered for Indian cooking in Mumbai apartments. BWP marine ply, quartz countertops, Blum soft-close fittings & anti-pest sealing. Book a consultation.',
    categoryGroup: 'Primary',
    description: 'Ergonomic, moisture-proof modular kitchens engineered for intense Indian cooking and compact Mumbai spaces.',
    longDescription: 'The Indian kitchen demands heavy-duty performance: high heat, turmeric, mustard oil splatters, and relentless monsoon humidity. Our modular kitchens are built strictly with IS:710 boiling waterproof (BWP) calibrated plywood, factory edge-banded with PUR waterproof glue to prevent moisture delamination. We engineer the classic Work Triangle (Prep, Cook, Wash) into even the most compact 80 sq. ft. Mumbai galley kitchens, utilizing motorized tandem boxes, corner carousels, quartz countertops, and dedicated spice pull-outs.',
    icon: PaintBucket,
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
    features: [
      '100% boiling waterproof marine plywood carcasses (IS:710)',
      'German soft-close hinges & tandem drawer systems with lifetime warranty',
      'Stain-proof, non-porous Quartz & Granite countertop fabrication',
      'Anti-termite and anti-borer certified base cabinets with PVC skirting',
      'Dedicated housing for high-suction chimneys (1200+ m3/hr), dishwashers, and ovens'
    ],
    suggestions: [
      'Opt for seamless acrylic or quartz backsplashes to eliminate difficult-to-clean tile grout lines.',
      'Select a parallel or L-shaped layout in compact Mumbai flats to maximize counter workspace.',
      'Install under-cabinet 4000K LED strip lighting to illuminate food prep zones without casting body shadows.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1556911223-e250e334621c?w=1200&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ce?w=1200&q=80',
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1200&q=80'
    ],
    layouts: [
      { name: 'Parallel Galley Kitchen', description: 'The gold standard for Mumbai flats, separating wet sink work from dry cooking counters.' },
      { name: 'L-Shaped Efficiency', description: 'Maximizes corner space with magic corner carousels while leaving room for a compact breakfast ledge.' },
      { name: 'Island & Open Gourmet Kitchen', description: 'Statement island with waterfall quartz edge, breakfast counter seating, and integrated wine cooler.' }
    ],
    materials: ['IS:710 BWP Marine Plywood', 'Calibrated BWR Grade Ply for overheads', '18mm Engineered Quartz / Indian Granite', 'Stainless Steel 304 Grade baskets'],
    finishes: ['Anti-scratch High Gloss Acrylic', 'Polyurethane (PU) Matte Lacquer', 'Anti-fingerprint Matte Laminate', 'Fluted Glass aluminum-framed shutters'],
    hardwareAndLighting: ['Blum Tandembox antaro / legrabox', 'Hettich Sensys 110-degree hinges', 'Hafele corner carousel systems', 'Recessed IP65 warm-white profile lighting'],
    processSteps: [
      { step: '01', title: 'Work Triangle & Ergonomic Mapping', desc: 'Measuring water inlet/drain lines, gas piping, electrical points, and appliance dimensions.' },
      { step: '02', title: '3D Kitchen Elevation & Module Config', desc: 'Designing drawer-to-cabinet ratios, spice racks, tall units, and sink placement.' },
      { step: '03', title: 'Factory Carcass Production', desc: 'Precision CNC routing, edge banding with PUR waterproof glue, and pre-drilled hinge sockets.' },
      { step: '04', title: 'On-Site Countertop & Fitting', desc: 'Leveling base modules on waterproof PVC legs, quartz mitred edging, and appliance hookup.' },
      { step: '05', title: 'Waterproofing & Silicone Sealing', desc: 'Antibacterial silicone sealing behind sink and countertop to prevent water seepage into carcasses.' }
    ],
    faqs: [
      { question: 'Why is BWP marine plywood essential for kitchens in Mumbai?', answer: 'Mumbai coastal humidity and daily Indian cooking with steam can quickly cause regular MDF or particle board to swell and rot within 2 years. We exclusively use IS:710 certified marine plywood that withstands boiling water for 72+ hours.' },
      { question: 'Which countertop material is best: Quartz or Granite?', answer: 'Granite is naturally heat-resistant and durable. Premium Quartz offers non-porous stain resistance against turmeric and lemon juice, with seamless joint lines and consistent luxury patterns.' },
      { question: 'How long does a modular kitchen installation take?', answer: 'Factory fabrication takes roughly 20-25 days. On-site installation, including countertop fitting and plumbing, is typically completed within 4 to 6 days.' }
    ]
  },

  // 4. Living Room Interior Design
  {
    id: 'living-room-interior-design',
    slug: 'living-room-interior-design',
    title: 'Living Room Interior Design',
    h1: 'Luxury Living Room Interior Design in Mumbai',
    seoTitle: 'Living Room Interior Designers Mumbai | Modern Lounges & TV Units | Sonu Enterprises',
    metaDescription: 'Transform your living room into an opulent retreat. Bespoke TV units, Italian marble accents, architectural lighting & custom seating for Mumbai homes. Explore our portfolio.',
    categoryGroup: 'Room Interior',
    description: 'Statement living rooms featuring bespoke TV consoles, acoustic panelling, and luxurious layered lighting.',
    longDescription: 'The living room establishes the design vocabulary of your entire residence. We specialize in crafting living spaces that balance grand entertaining with cozy family life. In Mumbai apartments where living and dining areas often merge, we design visual zoning through subtle ceiling drops, ribbed acoustic panelling, fluted marble feature walls, and floating media consoles with integrated wire management.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    features: [
      'Custom wall-to-wall floating entertainment units with concealed raceways',
      'Feature accent walls with Italian marble, charcoal louvers, or acoustic fluting',
      'Curated seating ergonomics with custom fabrics, bouclé, and top-grain leather',
      'Multi-tiered lighting: Cove ambient, magnetic accent tracks, and decorative chandeliers',
      'Integrated dining zones and bespoke display bars'
    ],
    suggestions: [
      'Incorporate mirrors or tinted glass panels opposite windows to double natural light penetration.',
      'Mount your television with concealed conduits inside wall panelling for a wire-free presentation.',
      'Layer textures—combining ribbed wood, smooth stone, and woven upholstery—to add richness without clutter.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80'
    ],
    layouts: [
      { name: 'Formal Living & Dining Combo', description: 'Dual-zone layout connected by cohesive stone tones and acoustic ceiling treatments.' },
      { name: 'Minimalist High-Rise Lounge', description: 'Low-profile sectional seating orienting focus toward skyline window vistas.' },
      { name: 'Compact 2BHK Smart Salon', description: 'Wall-hung modular media unit with integrated study ledge and hidden bar cabinet.' }
    ],
    materials: ['Imported Italian Marble (Dyna, Michael Angelo)', 'Acoustic Charcoal Louvers', 'Commercial Ply with Teak / Walnut Veneer', 'Tempered Fluted Glass'],
    finishes: ['PU Gloss and Satin Polyurethane', 'Natural Wood Oils & Matt Polycoat', 'Champagne Gold PVD Stainless Steel', 'Limewash / Stucco wall finish'],
    hardwareAndLighting: ['Hafele push-to-open latches', 'Cove LED ribbons 2835 SMD 120 led/m', 'Magnetic track lighting with spotlight & flood modules'],
    processSteps: [
      { step: '01', title: 'Spatial Planning & Circulation', desc: 'Balancing sofa clearance, walking paths to balconies, and optimal TV viewing distance.' },
      { step: '02', title: 'Feature Wall & Lighting Design', desc: 'Detailing stone joints, louver spacing, and cove drop heights.' },
      { step: '03', title: 'Civil & Ceiling Framing', desc: 'Gypsum ceiling framing, speaker wire conduit installation, and back-box prep.' },
      { step: '04', title: 'Panelling & Media Console Fitting', desc: 'Mounting structural panelling, LED channel embedding, and veneer lacquering.' },
      { step: '05', title: 'Styling & Illumination Balancing', desc: 'Fine-tuning lighting color temperatures, curtain drapery, and furniture placement.' }
    ],
    faqs: [
      { question: 'How do you hide messy TV wires and set-top boxes?', answer: 'We build shallow 2 to 3-inch wall panelling with internal PVC conduits, allowing cables to run cleanly behind the wall directly to a ventilated low-profile console.' },
      { question: 'Can you create soundproofing for home theatre setups in apartments?', answer: 'Yes. We install high-density acoustic mineral wool behind fabric or wooden slatted acoustic panels to prevent sound leakage into neighboring flats.' }
    ]
  },

  // 5. Bedroom Interior Design
  {
    id: 'bedroom-interior-design',
    slug: 'bedroom-interior-design',
    title: 'Bedroom Interior Design',
    h1: 'Master & Guest Bedroom Interior Design in Mumbai',
    seoTitle: 'Bedroom Interior Designers Mumbai | Master Suites & Smart Storage | Sonu Enterprises',
    metaDescription: 'Custom bedroom interiors in Mumbai. Floor-to-ceiling wardrobes, upholstered headboard walls, ambient night lighting & space-saving hydraulic beds. Get a quote.',
    categoryGroup: 'Room Interior',
    description: 'Serene, hotel-grade bedroom suites designed for rest, featuring customized wardrobes and acoustic headboards.',
    longDescription: 'In high-density Mumbai living, the bedroom is your private sanctuary away from urban noise. Sonu Enterprises designs bedroom retreats with an emphasis on restorative acoustics, ergonomic mattresses, floor-to-ceiling storage, and warm lighting. From grand master suites with walk-in closets and dressing tables to space-optimized guest rooms and vibrant kids study bedrooms, our designs maximize every cubic foot.',
    icon: Bed,
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80',
    features: [
      'Full-height acoustic cushioned headboard walls with embedded reading lights',
      'Hydraulic lift-up storage beds with internal dust-proof partitions',
      'Concealed dressing units with LED halo vanity mirrors',
      'Integrated study/work-from-home nooks with cable organizers',
      'Blackout curtain pelmets integrated seamlessly into false ceilings'
    ],
    suggestions: [
      'Use 2700K extra warm white lighting in bedrooms to promote melatonin production and deep sleep.',
      'Extend wardrobes to the true ceiling slab with loft storage for seasonal luggage.',
      'Place full-length mirror panels on wardrobe doors to visually expand compact bedroom dimensions.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80',
      'https://images.unsplash.com/photo-1558882224-cca162730191?w=1200&q=80'
    ],
    layouts: [
      { name: 'Master Sanctuary', description: 'King-sized bed flanked by dual floating nightstands, walk-in dressing wardrobe, and private vanity lounge.' },
      { name: 'Compact 2BHK Bedroom', description: 'Sliding wardrobe with mirror front, hydraulic storage bed, and wall-mounted work desk.' },
      { name: 'Kids & Teens Suite', description: 'Dual study zone, ergonomic bunk or pull-out trundle bed, and interactive book display units.' }
    ],
    materials: ['BWP Plywood', 'Century Laminates', 'Imported Suede & Bouclé upholstery fabrics', 'Tinted Grey/Bronze Mirrors'],
    finishes: ['Anti-scratch soft matte laminate', 'Natural wood veneer with PU seal', 'Brushed rose-gold profile handles'],
    hardwareAndLighting: ['Hettich WingLine bi-fold sliding hardware', 'Flexible directional LED reading spotlights', 'Motion-sensor wardrobe closet lights'],
    processSteps: [
      { step: '01', title: 'Mattress & Clearance Planning', desc: 'Allocating minimum 30-inch walking clearance around the bed and wardrobe door swing.' },
      { step: '02', title: 'Wardrobe Internal Organization', desc: 'Customizing long-coat hanging, shirt racks, watch/jewellery drawers, and shoe organizers.' },
      { step: '03', title: 'Carpentry & Headboard Fabrication', desc: 'Fabricating carcass modules, high-density foam headboard paneling, and electrical bedside points.' },
      { step: '04', title: 'Finishing & Soft Furnishings', desc: 'Pressing laminates, installing soft-close fittings, mirror positioning, and curtain tracking.' }
    ],
    faqs: [
      { question: 'Do you make hydraulic storage beds on-site?', answer: 'Yes. We build customized hydraulic beds using heavy-duty German gas-lift struts matched to your mattress weight, allowing effortless single-handed lifting.' },
      { question: 'What is the best wardrobe type for a small bedroom: Hinged or Sliding?', answer: 'For rooms with less than 3 feet of space between the bed and wardrobe, sliding or bi-fold doors are essential as they eliminate door swing obstruction.' }
    ]
  },

  // 6. Wardrobe Design
  {
    id: 'wardrobe-design',
    slug: 'wardrobe-design',
    title: 'Wardrobe & Storage Design',
    h1: 'Custom Wardrobes & Walk-in Closets in Mumbai',
    seoTitle: 'Custom Wardrobe Designers Mumbai | Sliding & Walk-in Closets | Sonu Enterprises',
    metaDescription: 'Bespoke wardrobes in Mumbai: floor-to-ceiling sliding closets, walk-in wardrobes, lacquered glass doors & German soft-close fittings. Custom internal storage planning.',
    categoryGroup: 'Room Interior',
    description: 'Precision-engineered sliding, hinged, and walk-in wardrobe solutions built to maximize vertical volume.',
    longDescription: 'Wardrobes are the ultimate storage backbone of urban homes. Sonu Enterprises designs customized wardrobe systems engineered around your exact lifestyle—incorporating designated sections for Indian ethnic wear, western formals, accessories, watches, handbags, and travel luggage. We build floor-to-ceiling installations with zero wasted space, utilizing German sliding mechanisms, sensor-activated interior illumination, and moisture-resistant marine ply carcasses.',
    icon: Ruler,
    image: 'https://images.unsplash.com/photo-1558882224-cca162730191?w=1200&q=80',
    features: [
      'Floor-to-ceiling storage maximizing vertical height with loft units',
      'Heavy-duty floor-mounted or top-hung sliding systems with soft deceleration',
      'Velvet-lined jewellery, watch, and sunglasses pull-out organizers',
      'Built-in wardrobe sensor strip lighting activated upon door opening',
      'Integrated concealed locker security and iron-board pull-outs'
    ],
    suggestions: [
      'Use tinted bronze or fluted glass shutters to add luxury depth while keeping contents discreet.',
      'Dedicate at least 48 inches of vertical height for long garments like sarees, kurtas, and dresses.',
      'Incorporate internal dehumidifier vents or camphor holders for Mumbai monsoon protection.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558882224-cca162730191?w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80'
    ],
    layouts: [
      { name: 'Sliding Door System', description: 'Ideal for tight spaces; 2 or 3 large format panels with top-hung silent tracks.' },
      { name: 'Classic Hinged Wardrobe', description: 'Allows 100% full internal visibility with slim aluminum profile frames and 165-degree hinges.' },
      { name: 'Luxury Walk-in Closet', description: 'U-shaped or L-shaped island closet with glass vitrines, shoe displays, and ambient backlighting.' }
    ],
    materials: ['IS:710 Marine Grade Plywood', 'Slim Aluminum Profile frames', 'Fluted / Tinted Toughened Glass', 'Velvet & Suede Drawer Liners'],
    finishes: ['Ultra-matt anti-scratch acrylic', 'High-gloss lacquer', 'Textured fabric-feel laminate', 'Anodized black/gold metal profiles'],
    hardwareAndLighting: ['Hettich TopLine XL sliding hardware', 'Blum CLIP top BLUMOTION hinges', 'Hafele Loox LED automated sensor profiles'],
    processSteps: [
      { step: '01', title: 'Wardrobe Inventory Audit', desc: 'Cataloguing hanger counts, folded clothes, shoe pairs, and locker requirements.' },
      { step: '02', title: 'Internal Layout Drafting', desc: 'Precision 2D drawings showing exact shelf heights, drawer depths, and loft divisions.' },
      { step: '03', title: 'Factory Carcass Fabrication', desc: 'CNC cutting, edge-sealing, and pre-routing for LED profile channels.' },
      { step: '04', title: 'On-site Erection & Alignment', desc: 'Laser-guided carcass levelling, track installation, door shutter balance, and sensor testing.' }
    ],
    faqs: [
      { question: 'What sliding wardrobe mechanism do you recommend for heavy doors?', answer: 'We use Hettich TopLine XL or Hafele sliding gear rated for up to 80kg per shutter, with dual-directional soft-closing dampers to ensure butter-smooth, silent operation.' },
      { question: 'How do you prevent fungus and bad odors inside wardrobes during Mumbai monsoons?', answer: 'We use 100% BWP plywood, avoid cheap untreated particle board, seal all exposed edges with 2mm PVC banding, and install micro-ventilation louvers.' }
    ]
  },

  // 7. Bathroom Interior Design
  {
    id: 'bathroom-interior-design',
    slug: 'bathroom-interior-design',
    title: 'Bathroom Interior & Renovation',
    h1: 'Luxury Bathroom Interior Design & Renovation in Mumbai',
    seoTitle: 'Luxury Bathroom Renovation Mumbai | Wet/Dry Zoning & Waterproofing | Sonu Enterprises',
    metaDescription: 'Turnkey luxury bathroom renovations in Mumbai. Comprehensive waterproofing, wet/dry zoning, wall-hung vanities, premium sanitary fittings & rain showers. Request a quote.',
    categoryGroup: 'Room Interior',
    description: 'Spa-inspired bathroom makeovers with multi-layer waterproofing, wet/dry zoning, and designer vanities.',
    longDescription: 'A luxury bathroom must combine sensory indulgence with uncompromising structural waterproofing. In high-rise Mumbai buildings where bathroom leaks cause severe disputes with lower-floor neighbors, Sonu Enterprises implements a foolproof 4-stage elastomeric waterproofing process before laying a single tile. We install wet and dry zone glass partitions, concealed diverters, floating storage vanities, backlit mirrors, and large-format porcelain slabs for grout-free hygiene.',
    icon: HardHat,
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521477?w=1200&q=80',
    features: [
      'Guaranteed 4-layer elastomeric waterproofing with 10-year anti-leak warranty',
      'Wet and dry zoning with 10mm toughened glass shower enclosures',
      'Concealed plumbing using CPVC / UPVC pipes and pressure testing',
      'Wall-hung water-resistant vanities with solid surface or quartz basins',
      'Niche storage with warm LED backlight for shampoo and amenity displays'
    ],
    suggestions: [
      'Use 4x2 ft or 6x4 ft large-format tiles to drastically reduce grout joints that attract soap scum and mold.',
      'Install a false ceiling with moisture-resistant gypsum or PVC grid to conceal geyser and plumbing stacks.',
      'Ensure a minimum 1:50 floor slope in the wet shower area toward a linear trench drain.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1620626011761-9963d7521477?w=1200&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'
    ],
    layouts: [
      { name: 'Linear 3-Fixture Layout', description: 'Classic arrangement placing vanity, WC, and shower along a single plumbing chase wall.' },
      { name: 'Master Spa Suite', description: 'Dual vanity basin, freestanding soaking tub, enclosed glass rain-shower, and private WC cubicle.' },
      { name: 'Compact Powder Room', description: 'Statement wallpaper or marble accent wall with vessel basin and dramatic pendant lighting.' }
    ],
    materials: ['Vitrified Porcelain Slabs (Kajaria / Somany)', 'BWP Marine Ply with High-Pressure Laminate', '10mm Toughened Glass', 'CPVC Astral pipes'],
    finishes: ['Matte stone finish', 'Terrazzo & Slate textures', 'PVD Matte Black / Brushed Gold fixtures'],
    hardwareAndLighting: ['Grohe / Kohler / Jaquar concealed diverters', 'Anti-fog LED touch mirrors', 'IP65 waterproof shower downlights'],
    processSteps: [
      { step: '01', title: 'Complete Demolition & Surface Prep', desc: 'Careful removal of old tiles, plastering to plumb, and inspecting main drainage stacks.' },
      { step: '02', title: 'Plumbing & Hydrostatic Pressure Test', desc: 'Routing concealed hot/cold lines and pressure testing at 10 bar to confirm zero joint leakage.' },
      { step: '03', title: 'Multi-layer Elastomeric Waterproofing', desc: 'Polymer modified cementitious coating with coving at joints and 72-hour pond testing.' },
      { step: '04', title: 'Tile Cladding & Niche Detailing', desc: 'Laser level tiling with epoxy grout for zero stain absorption.' },
      { step: '05', title: 'Sanitary Ware & Glass Installation', desc: 'Mounting wall-hung WC, concealed cistern, glass shower door, and silicone caulking.' }
    ],
    faqs: [
      { question: 'How do you guarantee that bathroom renovation won’t leak to the flat below?', answer: 'We conduct a mandatory 72-hour pond test where the bathroom floor is flooded with water and inspected from the ceiling below before tile laying begins.' },
      { question: 'What is epoxy grout and why do you use it in bathrooms?', answer: 'Standard cement grout absorbs water, discolors, and breeds black mold within months. Epoxy grout is completely waterproof, chemical-resistant, and maintains its color permanently.' }
    ]
  },

  // 8. False Ceiling & Lighting Design
  {
    id: 'false-ceiling-design',
    slug: 'false-ceiling-design',
    title: 'False Ceiling & Architectural Lighting',
    h1: 'False Ceiling Design & Architectural Lighting in Mumbai',
    seoTitle: 'False Ceiling Designers Mumbai | Gypsum Ceilings & Magnetic Tracks | Sonu Enterprises',
    metaDescription: 'Modern false ceiling design in Mumbai. Saint-Gobain Gyproc ceilings, perimeter cove lighting, magnetic track lights & acoustic baffles. Elevate your interior ambiance.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Architectural ceilings crafted with genuine Saint-Gobain Gyproc, cove accents, and magnetic track systems.',
    longDescription: 'Ceilings are the fifth wall of your home. A thoughtfully engineered false ceiling conceals electrical conduits, AC copper piping, and structural beams while sculpting the ambiance of each room. Sonu Enterprises uses genuine Saint-Gobain Gyproc boards and heavy-gauge galvanized GI channels to guarantee crack-free ceilings that never sag over time. We integrate layered lighting schemes—combining soft perimeter coves, glare-free architectural downlights, and magnetic tracks.',
    icon: Key,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=1200&q=80',
    features: [
      'Original Saint-Gobain Gyproc 12.5mm boards and certified GI framing',
      'Crack-resistant jointing tape and Gyproc jointing compound',
      'Multi-tier perimeter cove lighting with indirect warm white LED ribbons',
      'Magnetic low-voltage track lighting for modular spotlight positioning',
      'Acoustic insulation options for high-noise apartments near arterial roads'
    ],
    suggestions: [
      'Maintain at least 9 feet of clear floor-to-ceiling height by keeping peripheral drops under 5 inches.',
      'Use indirect cove illumination as your primary relaxed evening lighting rather than bright overhead bulbs.',
      'Ensure ceiling fan downrods and chandelier hooks are anchored directly to the true RCC slab, never to the false ceiling frame.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80',
      'https://images.unsplash.com/photo-1560184897-62429407db3a?w=1200&q=80'
    ],
    layouts: [
      { name: 'Perimeter Cove Minimalist', description: 'Clean ceiling plane with perimeter drop hiding LED strip for a floating ceiling illusion.' },
      { name: 'Coffered Architectural Ceiling', description: 'Grid-patterned sunken panels with wooden mouldings for formal living and dining halls.' },
      { name: 'Wooden Rafter & Louver Accent', description: 'Fluted wood or veneer rafters running across the foyer and dining ceiling for warmth.' }
    ],
    materials: ['Saint-Gobain Gyproc Plasterboard', 'Heavy GI Section Channels (0.50mm B.M.T.)', 'PVC Moisture-Resistant Ceiling panels', 'Calcium Silicate boards'],
    finishes: ['Seamless Asian Paints Royale Luxury Emulsion', 'Natural Wood Veneer inlays', 'Textured stucco plaster'],
    hardwareAndLighting: ['Philips / Wipro / Havells COB spot luminaires', 'Osram LED strip 24V constant voltage', 'Recessed low-voltage magnetic tracks'],
    processSteps: [
      { step: '01', title: 'Laser Level Grid Alignment', desc: 'Mapping structural beams, AC conduits, and snapping chalk lines with laser levels.' },
      { step: '02', title: 'GI Channel Framework Fixing', desc: 'Anchoring perimeter channels and intermediate brackets to RCC slab with metal rawl plugs.' },
      { step: '03', title: 'Electrical Wiring & Cutouts', desc: 'Pulling FRLS copper wires in flexible PVC pipes before board fixing.' },
      { step: '04', title: 'Gyproc Board Fixing & Joint Taping', desc: 'Screwing boards with drywall screws, applying paper tape, and 3-coat compound filling.' },
      { step: '05', title: 'Sanding, Priming & Paint Finish', desc: 'Machine sanding for a glass-smooth finish, primer coat, and 2 coats of luxury emulsion.' }
    ],
    faqs: [
      { question: 'Will a false ceiling reduce the room height significantly?', answer: 'Our streamlined perimeter drop designs require only 4.5 to 5 inches of clearance around the edges, keeping the main center ceiling at maximum height.' },
      { question: 'How do you prevent cracks at the ceiling joints over time?', answer: 'We use genuine Saint-Gobain perforated jointing tape and specialized elastic jointing compound rather than cheap POP plaster, which cracks when weather temperature fluctuates.' }
    ]
  },

  // 9. TV Unit & Media Console Design
  {
    id: 'tv-unit-design',
    slug: 'tv-unit-design',
    title: 'TV Unit & Media Console Design',
    h1: 'Designer TV Units & Entertainment Consoles in Mumbai',
    seoTitle: 'TV Unit Interior Designers Mumbai | Floating Media Consoles | Sonu Enterprises',
    metaDescription: 'Custom TV unit designs for Mumbai homes. Floating consoles, marble & fluted panel backdrops, concealed wire management & integrated display lighting. Get a design quote.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Floating entertainment centers with concealed cabling, acoustic slat walls, and integrated display vitrines.',
    longDescription: 'The modern TV unit is no longer just a table for an appliance; it is the focal anchor of the living room. Sonu Enterprises designs bespoke TV walls featuring fluted wooden louvers, Italian marble or quartz backdrops, tinted glass curio cabinets, and floating consoles with acoustic fabric grilles for soundbars. Every cable, set-top box, gaming console, and adapter is completely concealed within ventilated, push-to-open compartments.',
    icon: Tv,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    features: [
      'Concealed internal cable channels and IR-pass glass doors for remote controls',
      'Italian marble, ceramic tile, or charcoal louver back panels',
      'Floating low-profile consoles with soft-close drawers and wire grommets',
      'Integrated edge-lit LED profile channels with smart dimmer controls',
      'Acoustic fabric grill compartments for subwoofers and soundbars'
    ],
    suggestions: [
      'Size the TV backdrop wall proportional to the room, extending it horizontally to visually stretch compact living spaces.',
      'Incorporate 3000K warm backlighting behind the TV to reduce eye fatigue during nighttime viewing.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&q=80'
    ],
    layouts: [
      { name: 'Floating Minimalist Console', description: 'Suspended storage box with fluted stone backdrop and concealed LED halo.' },
      { name: 'Full-Wall Entertainment Unit', description: 'Integrated bookshelf, display vitrine, wine bar, and acoustic soundbar niche.' }
    ],
    materials: ['IS:710 Marine Plywood', 'Calacatta / Statuario Quartz Slabs', 'Ribbed Charcoal Panels', 'Toughened Fluted Glass'],
    finishes: ['PU High Gloss / Matte', 'Natural Veneer with PU Polish', 'Brushed Champagne Gold Profile Edges'],
    hardwareAndLighting: ['Blum Movento soft-close concealed runners', 'Hafele cable grommets', '2835 warm-white flexible LED strips'],
    processSteps: [
      { step: '01', title: 'Audio-Visual Equipment Audit', desc: 'Checking TV screen diagonal, soundbar size, PlayStation/consoles, and socket locations.' },
      { step: '02', title: 'Wall Panelling & Conduit Routing', desc: 'Installing internal PVC pipe channels for HDMI, power, and optical cables.' },
      { step: '03', title: 'Console Carcass Assembly & Mounting', desc: 'Heavy-duty wall anchoring with Fischer frame anchors.' },
      { step: '04', title: 'Stone / Louver Cladding & Lighting Hookup', desc: 'Precision cladding and testing LED dimmers.' }
    ],
    faqs: [
      { question: 'Can a floating TV unit hold heavy equipment and large TVs safely?', answer: 'Yes. Our consoles are anchored directly into solid masonry using heavy-duty chemical anchors rated for over 150 kg load capacity.' },
      { question: 'Will remote controls work if the set-top box is hidden inside the cabinet?', answer: 'We use acoustic mesh, IR-friendly smoked glass, or IR repeater sensors so remotes operate flawlessly through closed doors.' }
    ]
  },

  // 10. Balcony & Deck Design
  {
    id: 'balcony-design',
    slug: 'balcony-design',
    title: 'Balcony & Deck Living Design',
    h1: 'Balcony Transformation & Deck Design in Mumbai',
    seoTitle: 'Balcony Interior Designers Mumbai | Weatherproof Decks & Vertical Gardens | Sonu Enterprises',
    metaDescription: 'Transform your Mumbai balcony into a private oasis. Weatherproof WPC decking, vertical gardens, glass railings & outdoor bar ledges. Built for Mumbai monsoons.',
    categoryGroup: 'Room Interior',
    description: 'Weatherproof balcony retreats with composite decking, vertical green walls, and cozy bar ledges.',
    longDescription: 'In Mumbai apartments, a balcony is your invaluable connection to fresh air and sky. However, harsh monsoons and intense summer heat often leave balconies underutilized. Sonu Enterprises transforms balconies into lush private retreats engineered to endure coastal weather. We install weatherproof Wood-Polymer Composite (WPC) decking, vertical hydroponic green walls, weather-resistant outdoor bar counters, and ambient waterproof lighting.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    features: [
      '100% waterproof and termite-proof Wood Plastic Composite (WPC) decking',
      'Artificial vertical green walls or automated drip-irrigation live planters',
      'Weather-resistant granite or solid surface breakfast/coffee ledges',
      'IP67 outdoor waterproof warm-white LED garden lighting',
      'Anti-bird netting and mosquito mesh integration without compromising aesthetics'
    ],
    suggestions: [
      'Ensure deck tiles have elevated drainage channels underneath so rainwater drains instantly toward floor traps.',
      'Pair comfortable hanging swing chairs with compact folding tables for flexible lounging.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Coffee & Breakfast Nook', description: 'Sleek railing-mounted bar counter with high stools and green planter backdrop.' },
      { name: 'Zen Garden Sanctuary', description: 'WPC wooden pathway bordered with river pebbles, Buddha sculpture, and bamboo screening.' }
    ],
    materials: ['High-density WPC Decking Planks', 'Outdoor Vitrified Tiles (R11 slip rating)', 'Exterior grade SS 316 hardware', 'UV-stabilized artificial turf'],
    finishes: ['Teak / Ipe wood texture WPC', 'Natural slate stone', 'Weatherproof exterior PU coating'],
    hardwareAndLighting: ['Stainless Steel 304/316 fasteners', 'IP67 waterproof step and planter lights'],
    processSteps: [
      { step: '01', title: 'Rainwater Slope & Drainage Audit', desc: 'Verifying floor slope and waterproofing membrane condition.' },
      { step: '02', title: 'Sub-frame Grid Installation', desc: 'Laying elevated aluminum or PVC battens to ensure free water flow under decking.' },
      { step: '03', title: 'Decking & Railing Integration', desc: 'Clipping WPC planks with concealed clips; mounting breakfast counters.' },
      { step: '04', title: 'Green Wall & Electrical Setup', desc: 'Installing vertical foliage framework and waterproof switches.' }
    ],
    faqs: [
      { question: 'Will WPC decking rot or warp during heavy Mumbai monsoons?', answer: 'No. WPC is engineered from recycled polymer and wood fiber that does not absorb moisture, swell, crack, or rot even when submerged.' },
      { question: 'Can you install balcony bar counters without drilling into safety railings?', answer: 'Yes, we design custom self-supporting clamp systems that anchor securely to the railing without violating society facade alterations.' }
    ]
  },

  // 11. Pooja Room Design
  {
    id: 'pooja-room-design',
    slug: 'pooja-room-design',
    title: 'Mandir & Pooja Room Design',
    h1: 'Vastu-Compliant Mandir & Pooja Room Design in Mumbai',
    seoTitle: 'Pooja Room Interior Designers Mumbai | Vastu Mandirs & Jali Units | Sonu Enterprises',
    metaDescription: 'Sacred, Vastu-compliant Mandir and Pooja room designs for Mumbai apartments. CNC brass jali screens, backlit onyx stone, marble altars & smart incense ventilation.',
    categoryGroup: 'Room Interior',
    description: 'Sacred, peaceful prayer spaces harmonizing Vastu Shastra principles with contemporary luxury craftsmanship.',
    longDescription: 'In Indian homes, the Mandir is the spiritual epicenter. Designing a sacred sanctuary within modern Mumbai apartment floor plans requires deep reverence for Vastu Shastra paired with refined design. Sonu Enterprises crafts bespoke pooja rooms and standalone temple units featuring intricate CNC-cut jali partitions, backlit translucent onyx or Corian stone, bell-embedded wooden shutters, dedicated brassware drawers, and fire-safe incense ventilation.',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
    features: [
      'Strict adherence to Vastu Shastra orientations (Northeast / Ishanya direction preferred)',
      'Intricate CNC jali screens in wood, brass, or Corian with Om/Swastika motifs',
      'Translucent backlit onyx stone or alabaster backgrounds for divine radiance',
      'Fire-safe metal/quartz surfaces for Diya and incense burner placement',
      'Drawers with designated organizers for pooja samagri, holy books, and oils'
    ],
    suggestions: [
      'Install warm 2700K indirect backlighting behind the deity idol to create an ethereal golden halo.',
      'In compact flats, integrate the Mandir into a serene living-dining alcove enclosed with foldable laser-cut screens.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Dedicated Sanctuary Room', description: 'Enclosed room with marble threshold, jali double doors, and ceiling dome.' },
      { name: 'Alcove Mandir Unit', description: 'Custom-built floor-to-ceiling cabinet with floating marble altar and brass bell inserts.' }
    ],
    materials: ['White Makrana / Carrara Marble', 'Backlit Onyx / Corian Sheet', 'Teak Wood / High-density Marine Ply', 'Pure Brass fittings and bells'],
    finishes: ['Hand-rubbed natural Teak oil', 'High-gloss white PU lacquer', 'Champagne gold leafing accents'],
    hardwareAndLighting: ['Soft-close heavy-duty runners', 'Concealed LED light sheets for uniform onyx backlighting'],
    processSteps: [
      { step: '01', title: 'Vastu Direction Verification', desc: 'Verifying Northeast / East orientation and spatial relationship to adjacent rooms.' },
      { step: '02', title: 'Idol Dimension & Altar Elevation Drafting', desc: 'Customizing tiered pedestals, storage drawers, and brass bell placements.' },
      { step: '03', title: 'CNC Jali & Stone Carving', desc: 'Precision laser cutting of sacred geometric patterns.' },
      { step: '04', title: 'Assembly & Electrical Installation', desc: 'Fitting heat-proof Diya surfaces, incense exhaust, and warm lighting.' }
    ],
    faqs: [
      { question: 'Can you design a Vastu-compliant Mandir in a compact 1BHK or 2BHK flat?', answer: 'Yes. We specialize in designing space-efficient wall-hung or alcove Mandirs positioned in the Vastu-approved Northeast or East quadrant.' },
      { question: 'How do you protect wooden Mandir surfaces from Diya heat and oil stains?', answer: 'We integrate removable brass plates or heat-resistant quartz tops under the Diya area that wipe clean without damaging the woodwork.' }
    ]
  },

  // 12. Dining Room Design
  {
    id: 'dining-room-design',
    slug: 'dining-room-design',
    title: 'Dining Room & Bar Units',
    h1: 'Elegant Dining Room & Bar Counter Design in Mumbai',
    seoTitle: 'Dining Room Interior Designers Mumbai | Marble Dining & Crockery | Sonu Enterprises',
    metaDescription: 'Bespoke dining room interiors in Mumbai. Custom Italian marble dining tables, upholstered chairs, statement chandeliers & integrated crockery displays. Plan your dining space.',
    categoryGroup: 'Room Interior',
    description: 'Gathering spaces centering around custom Italian marble tables, statement lighting, and bar credenzas.',
    longDescription: 'The dining space is where families bond and guests are hosted. In modern Mumbai residences, dining areas require seamless aesthetic continuity with both the living lounge and modular kitchen. Sonu Enterprises designs custom marble and solid wood dining tables, ergonomic upholstered dining chairs, statement pendant lighting, and bespoke crockery consoles with wine chillers.',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
    features: [
      'Custom 6-seater and 8-seater dining tables with Italian marble or solid wood tops',
      'Comfort-padded chairs and space-saving bench seating upholstered in stain-resistant fabrics',
      'Statement dining chandeliers centered over the table with dimmer switches',
      'Integrated crockery credenzas with fluted glass vitrines and interior spotlights',
      'Compact pull-out dining extensions for hosting large dinner parties'
    ],
    suggestions: [
      'Maintain at least 36 inches of clearance between the dining table edge and surrounding walls for comfortable chair movement.',
      'Hang pendant chandeliers between 30 and 34 inches above the tabletop for optimal illumination without obstructing sightlines.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Open Living-Dining Continuum', description: 'Coordinated dining ensemble visually connected to the living room theme.' },
      { name: 'Intimate Dining Alcove', description: 'Upholstered banquet bench seating against a mirrored feature wall to maximize floor space.' }
    ],
    materials: ['Italian Botticino / Statuario Marble', 'Solid Teak / Ash Wood', 'Stain-resistant performance velvet', 'PVD coated steel table bases'],
    finishes: ['Sealed natural stone polish', 'Matte polyurethane wood seal', 'Brushed brass'],
    hardwareAndLighting: ['Dimmable warm pendant lights', 'Blum soft-close buffet hinges'],
    processSteps: [
      { step: '01', title: 'Table Sizing & Clearance Planning', desc: 'Determining ideal table dimensions based on family size and room circulation.' },
      { step: '02', title: 'Stone Selection & Edge Profiling', desc: 'Selecting stone slabs and detailing beveled or bullnose edge profiles.' },
      { step: '03', title: 'Custom Table Base & Chair Fabrication', desc: 'Crafting sturdy metal or wooden bases and ergonomic chair frames.' },
      { step: '04', title: 'Lighting Centerline & Buffet Installation', desc: 'Centering ceiling electrical junction over the table and mounting crockery units.' }
    ],
    faqs: [
      { question: 'How do you protect marble dining tables from food and curry stains?', answer: 'We apply a commercial-grade penetrating nano-sealant that protects porous Italian marble against turmeric, wine, and acidic spills.' },
      { question: 'Is bench seating a good idea for smaller Mumbai dining spaces?', answer: 'Yes! A customized dining bench can tuck completely under the table when not in use, freeing up valuable walking space.' }
    ]
  },

  // 13. Home Office Design
  {
    id: 'home-office-design',
    slug: 'home-office-design',
    title: 'Home Office & Study Design',
    h1: 'Ergonomic Home Office & Study Room Design in Mumbai',
    seoTitle: 'Home Office Interior Designers Mumbai | Work from Home & Study Spaces | Sonu Enterprises',
    metaDescription: 'Modern home office interiors in Mumbai. Ergonomic desks, acoustic wall panelling, concealed cable docks & bookshelf joinery for productive hybrid work. Book a design consult.',
    categoryGroup: 'Room Interior',
    description: 'Productive work-from-home suites with acoustic isolation, ergonomic desking, and concealed wire docks.',
    longDescription: 'With hybrid work now a permanent fixture for Mumbai professionals, makeshift dining-table workstations are no longer viable. Sonu Enterprises designs dedicated home office spaces and multi-functional study nooks engineered for focus. We incorporate ergonomic sit-stand desk joinery, acoustic felt wall panelling for echo-free Zoom calls, concealed charging docks, and curated background libraries for a professional video presence.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
    features: [
      'Ergonomic desk depths (minimum 24-30 inches) with rounded bevel edges',
      'Built-in wire raceways with pop-up power modules, HDMI, and USB-C docks',
      'Acoustic felt wall panels to eliminate room reverb during conference calls',
      'Floor-to-ceiling bookshelf joinery with integrated display lighting',
      'Glare-free task lighting positioned to prevent screen reflections'
    ],
    suggestions: [
      'Position your monitor perpendicular to windows to eliminate screen glare and eye fatigue.',
      'Incorporate a curated backdrop wall with wood slats or books to project a polished professional persona on video calls.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
    ],
    layouts: [
      { name: 'Dedicated Executive Study', description: 'Enclosed home office with executive desk, library wall, and guest consultation seating.' },
      { name: 'Dual-Workstation Hybrid Room', description: 'Dual desks with central shared printer/storage station for working couples.' },
      { name: 'Compact Bedroom Study Nook', description: 'Wall-mounted floating desk with overhead bookshelves integrated into wardrobe panelling.' }
    ],
    materials: ['BWP Plywood', 'High-density acoustic PET felt', 'Matte anti-fingerprint laminates', 'Solid ash wood edging'],
    finishes: ['Non-reflective satin finishes', 'Natural walnut veneer', 'Powder-coated metal brackets'],
    hardwareAndLighting: ['Pop-up motorized power grommets', '4000K neutral-white adjustable task lamps', 'Hafele cable spine organizers'],
    processSteps: [
      { step: '01', title: 'Tech & Hardware Requirement Audit', desc: 'Listing monitor setups, CPU mounts, printer space, and power outlets.' },
      { step: '02', title: 'Ergonomic Drafting & Acoustic Layout', desc: 'Optimizing desk height (29.5 inches standard) and sound absorption placement.' },
      { step: '03', title: 'Carpentry & Cable Raceway Routing', desc: 'Fabricating desks with internal cable troughs.' },
      { step: '04', title: 'Electrical Fit-out & Final Styling', desc: 'Connecting surge-protected power strips and testing task lighting.' }
    ],
    faqs: [
      { question: 'Can you fit a comfortable home office into a bedroom corner?', answer: 'Yes. We frequently design compact 4-foot floating study desks with overhead storage that blend seamlessly with bedroom aesthetics.' },
      { question: 'How do you reduce echo and background noise during video calls?', answer: 'We apply acoustic felt wall panels or wooden slatted acoustic boards behind the desk to absorb echo and voice reverb.' }
    ]
  },

  // 14. Staircase Design
  {
    id: 'staircase-design',
    slug: 'staircase-design',
    title: 'Custom Staircase & Railing Design',
    h1: 'Architectural Staircases & Railing Design in Mumbai',
    seoTitle: 'Custom Staircase Designers Mumbai | Duplex Stairs & Glass Railings | Sonu Enterprises',
    metaDescription: 'Bespoke architectural staircases for duplex penthouses and villas in Mumbai. Floating stairs, cantilevered wooden treads, toughened glass railings & step lighting.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Sculptural staircases and seamless glass balustrades designed for duplex penthouses and villas.',
    longDescription: 'In duplex apartments and luxury villas across Mumbai, the staircase is the grand architectural spine of the home. Sonu Enterprises designs bespoke floating cantilever staircases, structural steel stair frameworks, solid teak and marble treads, integrated step-lighting profiles, and frameless toughened glass or laser-cut metal railings. We balance breathtaking structural aesthetics with comfortable riser-to-tread step geometry.',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    features: [
      'Cantilevered floating steps anchored into structural RCC walls',
      'Solid wood treads in seasoned Teak or White Oak with anti-slip grooves',
      '12mm / 15mm frameless toughened glass railings with stainless steel spigots',
      'Concealed under-tread motion-activated warm LED step lights',
      'Smart utilization of under-stair volume for wine cellars or powder rooms'
    ],
    suggestions: [
      'Maintain an ideal 6 to 7-inch riser height and 10 to 11-inch tread depth for fatigue-free vertical ascension.',
      'Use frameless glass railings in duplexes to preserve sightlines and open volume.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Floating Cantilevered Flight', description: 'Individual wooden treads projecting seamlessly from a hidden structural steel stringer.' },
      { name: 'Curved Grand Staircase', description: 'Fluid, sweeping balustrades with continuous curved wooden handrails.' }
    ],
    materials: ['Heavy-gauge MS structural stringers', 'Seasoned CP Teak Wood', '12mm Toughened laminated glass', 'SS 316 architectural fittings'],
    finishes: ['PU matte anti-scratch wood coating', 'PVD coated brass handrails', 'Electrostatic powder coat'],
    hardwareAndLighting: ['Fischer heavy-duty wall anchors', 'IP65 waterproof warm step profile lights with PIR sensors'],
    processSteps: [
      { step: '01', title: 'Structural Load Calculation', desc: 'Verifying wall shear capacity for cantilevered steps.' },
      { step: '02', title: 'Steel Stringer Fabrication', desc: 'Precision welding and anchoring of primary steel chassis.' },
      { step: '03', title: 'Tread Fabrication & Cladding', desc: 'Routing teak treads with embedded LED channels.' },
      { step: '04', title: 'Glass Railing & Handrail Fixing', desc: 'Installing glass panels in recessed floor shoes and mounting continuous handrails.' }
    ],
    faqs: [
      { question: 'Are floating stairs safe for children and elderly family members?', answer: 'Yes. We install continuous safety glass balustrades and slip-resistant grooves, ensuring complete safety without blocking light.' },
      { question: 'Can you renovate an existing ugly concrete staircase in a duplex flat?', answer: 'Absolutely. We clad existing concrete staircases in premium Italian marble or teak wood treads and replace bulky railings with sleek glass.' }
    ]
  },

  // 15. Crockery Unit & Display Cabinets
  {
    id: 'crockery-unit-design',
    slug: 'crockery-unit-design',
    title: 'Crockery Unit & Display Cabinets',
    h1: 'Designer Crockery Units & Display Cabinets in Mumbai',
    seoTitle: 'Crockery Unit Designers Mumbai | Glass Vitrines & Bar Cabinets | Sonu Enterprises',
    metaDescription: 'Custom crockery units and display vitrines in Mumbai. Fluted glass shutters, warm backlighting, velvet-lined cutlery drawers & wine storage. View our designs.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Bespoke glassware and crockery vitrines featuring fluted glass, champagne metal frames, and interior lighting.',
    longDescription: 'Fine chinaware, crystal glassware, and heirloom dinner sets deserve an exquisite showcase. Sonu Enterprises crafts bespoke crockery units that double as architectural centerpieces between living and dining areas. We combine aluminum profile fluted glass shutters, warm internal spotlights, velvet-lined cutlery dividers, and integrated marble countertop serving surfaces.',
    icon: Grid,
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80',
    features: [
      'Slim anodized aluminum profile doors with toughened fluted glass',
      'Integrated LED glass shelf edge illumination',
      'Velvet-lined felt drawers for silverware and delicate cutlery',
      'Central buffet counter in Quartz or Italian marble for dinner serving',
      'Lower closed storage for large casserole pots and bulky dinnerware'
    ],
    suggestions: [
      'Incorporate fluted or tinted bronze glass to conceal internal clutter while adding amber evening warmth.',
      'Place your crockery unit adjacent to the dining table for effortless table setting during dinner parties.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Floor-to-Ceiling Glass Vitrine', description: 'Grand display with full glass front, internal spotlights, and lower buffet.' },
      { name: 'Floating Wall Credenza', description: 'Modern suspended console with fluted sliding panels and open marble serving ledge.' }
    ],
    materials: ['IS:710 Marine Plywood', 'Gold / Black Anodized Aluminum profiles', 'Toughened Fluted / Clear Glass', 'Quartz Serving Top'],
    finishes: ['Matte PU lacquer', 'Rich natural walnut veneer', 'Soft-touch anti-scratch laminate'],
    hardwareAndLighting: ['Blum soft-close concealed hinges', 'Hafele glass clip LED shelf lights'],
    processSteps: [
      { step: '01', title: 'Inventory Audit of Dinnerware', desc: 'Measuring plate stack diameters, wine glass stem heights, and serving bowls.' },
      { step: '02', title: 'Modular Design & Aluminum Profile Sizing', desc: 'Drafting glass shutter modules and internal shelf spacing.' },
      { step: '03', title: 'Carcass Fabrication & Profile Assembly', desc: 'Assembling BWP carcass and fitting custom aluminum glass doors.' },
      { step: '04', title: 'Electrical Wiring & Final Installation', desc: 'Hooking up shelf lights to door sensor switches.' }
    ],
    faqs: [
      { question: 'Will dust enter inside a glass crockery unit?', answer: 'We install high-density dust-exclusion brush seals along all aluminum profile door edges to keep your glassware spotless.' },
      { question: 'Can glass shelves hold heavy ceramic plate stacks safely?', answer: 'We use 8mm or 10mm toughened glass shelves supported by metal shelf pins capable of bearing up to 25 kg per shelf.' }
    ]
  },

  // 16. Home Bar Design
  {
    id: 'home-bar-design',
    slug: 'home-bar-design',
    title: 'Bespoke Home Bar & Lounge Design',
    h1: 'Luxury Home Bar & Lounge Interior Design in Mumbai',
    seoTitle: 'Home Bar Designers Mumbai | Modern Cocktail Counters & Cellars | Sonu Enterprises',
    metaDescription: 'Custom home bar counters and lounge interiors in Mumbai. Backlit onyx counters, temperature-controlled wine chillers, brass footrests & bespoke cocktail cabinets.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Sophisticated cocktail counters and wine lounges designed for private entertaining and relaxation.',
    longDescription: 'Entertaining in Mumbai homes has evolved into a bespoke art form. Sonu Enterprises crafts luxury home bars that bring the exclusivity of high-end speakeasies into your living space. We build custom bar counters featuring backlit onyx, brass footrests, hanging stemware racks, wine cooler integration, and mirror-backed bottle display shelves with dimmable theatrical lighting.',
    icon: Wine,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
    features: [
      'Backlit natural onyx or translucent quartz bar counters',
      'Overhead ceiling-suspended stemware racks in brushed brass or matte black',
      'Integrated electrical and ventilation provisions for dual-zone wine coolers',
      'Mirror-backed and LED-illuminated liquor display shelves',
      'Under-counter preparation sink with instant cold/hot RO water dispenser'
    ],
    suggestions: [
      'Install separate dimmable lighting zones for the bar counter and display shelves to set a sultry cocktail ambiance.',
      'Use non-porous quartz for the preparation counter to resist citrus acids and liquor stains.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Standalone Cocktail Counter', description: 'Island bar with barstool seating, footrest, and overhead brass glass rack.' },
      { name: 'Concealed Bar Cabinet (Armoire)', description: 'Discreet luxury cabinet that opens to reveal a mirror-backed bar station.' }
    ],
    materials: ['Translucent Honey Onyx / Alabaster', 'IS:710 Marine Plywood', 'Solid Brass footrails and rods', 'Smoked Bronze Mirrors'],
    finishes: ['High-gloss dark walnut veneer', 'Brushed Champagne Gold PVD', 'Matte black polyurethane'],
    hardwareAndLighting: ['Dimmable LED light sheets', 'Heavy-duty soft-close bottle pull-out baskets'],
    processSteps: [
      { step: '01', title: 'Wine Cooler & Barware Sizing', desc: 'Confirming dimensions of bar fridge, ice maker, and liquor inventory.' },
      { step: '02', title: 'Bar Elevation & Footrest Ergonomics', desc: 'Standardizing bar counter height at 42 inches for comfortable standing and stool use.' },
      { step: '03', title: 'Carcass Fabrication & Onyx Backlighting', desc: 'Installing diffusion panels and LED light sheets behind stone counter.' },
      { step: '04', title: 'Plumbing & Chiller Hookup', desc: 'Connecting prep sink, drainage trap, and dedicated electrical points.' }
    ],
    faqs: [
      { question: 'Can you integrate a wet bar with running water into a living room corner?', answer: 'Yes. We tap into adjacent plumbing chases or utilize discreet low-profile pumps to provide running water and drainage.' },
      { question: 'What is the ideal counter height for a home bar?', answer: 'Standard bar counters are built at 42 inches high paired with 30-inch barstools, creating a true lounge ambiance distinct from 36-inch kitchen counters.' }
    ]
  },

  // 17. Flooring Design
  {
    id: 'flooring-design',
    slug: 'flooring-design',
    title: 'Flooring & Surface Design',
    h1: 'Premium Flooring & Surface Solutions in Mumbai',
    seoTitle: 'Flooring Contractors Mumbai | Italian Marble & Engineered Wood | Sonu Enterprises',
    metaDescription: 'Exquisite flooring solutions for Mumbai residences. Italian marble laying & diamond polishing, engineered wooden floors, large vitrified slabs & microtopping. Get a quote.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Master-laid Italian marble, engineered hardwood, and large-format porcelain surfaces.',
    longDescription: 'Flooring constitutes the expansive canvas of every interior space. Sonu Enterprises delivers master-grade flooring execution—specializing in bookmatched Italian marble laying with zero-air-pocket bedding, mirror-finish diamond polishing, acoustic underlay engineered wooden floors, and seamless microtopping. Our master tile-setters use European laser leveling systems to guarantee millimeter-perfect alignment across your entire home.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    features: [
      'Italian marble procurement, bookmatching, laying, and 8-stage diamond polishing',
      'Engineered hardwood and Herringbone / Chevron wooden floor installation',
      'Seamless large-format vitrified slabs (8x4 ft) with epoxy grouting',
      'Moisture-barrier acoustic underlay to prevent hollow drumming sounds and dampness',
      'Level transitions between stone, wood, and tile with brass inlay profiles'
    ],
    suggestions: [
      'Bookmatch marble veins in the living room foyer to create a breathtaking natural art focal point.',
      'Opt for matte or satin finishes in high-traffic zones to conceal dust and subtle foot traffic scuffs.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ],
    layouts: [
      { name: 'Bookmatched Italian Marble', description: 'Mirrored stone veins creating a symmetrical butterfly pattern across living halls.' },
      { name: 'Herringbone Hardwood Pattern', description: 'Classic 90-degree interlocking wooden blocks adding depth and European elegance to bedrooms.' }
    ],
    materials: ['Italian Marble (Statuario, Michael Angelo, Dyna)', 'European Engineered Oak Wood', 'Glazed Vitrified Tiles (GVT)', 'Epoxy Tile Grout'],
    finishes: ['Mirror Gloss Diamond Polish', 'Honed / Leather Satin Finish', 'Brushed Natural Wood Oil'],
    hardwareAndLighting: ['Laser leveling clips', 'Solid brass T-profile threshold transition strips'],
    processSteps: [
      { step: '01', title: 'Sub-floor Screeding & Moisture Test', desc: 'Checking slab moisture content and screeding for level datum.' },
      { step: '02', title: 'Dry Lay & Vein Mapping', desc: 'Arranging all stone slabs on the floor before cementing to approve vein alignment.' },
      { step: '03', title: 'Adhesive Bedding & Laser Laying', desc: 'Laying with polymer-modified adhesive to eliminate hollow hollow sounds.' },
      { step: '04', title: 'Diamond Polishing & Crystallization', desc: 'Progressive grinding up to 3000 grit followed by Italian crystallization wax.' }
    ],
    faqs: [
      { question: 'What causes hollow sounds under tiles and how do you prevent it?', answer: 'Hollow tiles occur when contractors use dry cement mortar without polymer adhesives. We use 100% full-bed polymer adhesives with vibrating suction plates for zero air pockets.' },
      { question: 'Can engineered wood flooring withstand Mumbai humidity?', answer: 'Yes. Engineered wood is constructed with cross-laminated plywood base plies that prevent the expansion and cupping common in solid timber.' }
    ]
  },

  // 18. Wallpaper & Wall Coverings
  {
    id: 'wallpaper-design',
    slug: 'wallpaper-design',
    title: 'Luxury Wallpaper & Wall Treatments',
    h1: 'Luxury Wallpaper & Designer Wall Coverings in Mumbai',
    seoTitle: 'Luxury Wallpaper Installers Mumbai | Textured & Custom Wall Murals | Sonu Enterprises',
    metaDescription: 'High-end wall coverings and designer wallpapers in Mumbai. Textured grasscloth, metallic leafing, acoustic fabric & custom panoramic murals. Professional installation.',
    categoryGroup: 'Joinery & Architectural',
    description: 'Bespoke textured wall coverings, botanical murals, and metallic leafing that elevate room character.',
    longDescription: 'Walls represent the largest surface area in your home. Rather than flat monochrome paint, Sonu Enterprises breathes personality into spaces through bespoke wall coverings. From textured organic grasscloth and Japanese silk wallpapers to panoramic custom-printed botanical murals, acoustic fabric panelling, and hand-applied Italian lime plasters (Stucco Veneziano), our wall treatments introduce warmth and tactile luxury.',
    icon: PaintBucket,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    features: [
      'Imported non-woven, vinyl-coated, and fabric-backed designer wallpapers',
      'Seamless custom panoramic wall murals scaled to your exact wall dimensions',
      'Organic natural textured wall coverings (Grasscloth, Sisal, Cork, and Raw Silk)',
      'Moisture-resistant wallpaper adhesives with anti-fungal treatment for Mumbai air',
      'Handcrafted Stucco Veneziano, lime plaster, and gold-leaf accent walls'
    ],
    suggestions: [
      'Use a dramatic dark botanical wallpaper on the headboard wall while keeping the remaining walls in complementary neutral tones.',
      'Ensure all walls are treated with an anti-dampness primer before wallpaper application in coastal Mumbai homes.'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
    ],
    layouts: [
      { name: 'Accent Feature Wall', description: 'Single statement wall in living room or master bedroom anchoring the visual hierarchy.' },
      { name: 'Powder Room Jewel Box', description: 'Complete 4-wall immersion in bold, whimsical prints creating an unforgettable guest experience.' }
    ],
    materials: ['Heavyweight Non-Woven Paper', 'Commercial Fabric-Backed Vinyl', 'Natural Grasscloth & Jute', 'Italian Lime Plaster'],
    finishes: ['Matte tactile weave', 'Subtle metallic sheen', 'Gloss polished stucco'],
    hardwareAndLighting: ['Anti-fungal heavy-duty wallpaper adhesive', 'Concealed edge-lighting profiles'],
    processSteps: [
      { step: '01', title: 'Wall Moisture & Plumb Inspection', desc: 'Moisture meter reading to ensure moisture levels are below 12%.' },
      { step: '02', title: 'Surface Leveling & Primer Sealer', desc: 'Applying waterproof primer and fine sanding to eliminate all plaster imperfections.' },
      { step: '03', title: 'Pattern Alignment & Dry Matching', desc: 'Checking repeat pattern alignment and drop match across drops.' },
      { step: '04', title: 'Precision Edge Seaming', desc: 'Applying adhesive with seamless roller joints for completely invisible seams.' }
    ],
    faqs: [
      { question: 'Will wallpaper peel off during the humid Mumbai monsoon season?', answer: 'We apply a specialized waterproof base primer and commercial-grade anti-fungal adhesive formulated specifically for tropical coastal climates, preventing peeling or mold.' },
      { question: 'Can wallpapers be cleaned if someone stains them?', answer: 'Yes. We recommend vinyl-coated or scrubbable non-woven wallpapers for dining rooms and hallways, which easily wipe clean with a damp microfiber cloth.' }
    ]
  }
];

// ==========================================
// GENUINE MUMBAI OPERATIONAL LOCATIONS
// ==========================================

export const MUMBAI_LOCATIONS: MumbaiLocation[] = [
  {
    slug: 'kalyan-dombivli',
    name: 'Kalyan & Dombivli',
    suburbs: ['Khadakpada', 'Tilak Nagar', 'Dombivli East', 'Dombivli West', 'Gandhinagar', 'Kalyan West', 'Godrej Hill'],
    seoTitle: 'Interior Designer in Kalyan & Dombivli | Sonu Enterprises',
    metaDescription: 'Trusted interior design contractors based in Kalyan & Dombivli. 15+ years experience, turnkey flats, modular kitchens & bespoke wardrobes. Visit our local office.',
    h1: 'Interior Designers in Kalyan & Dombivli',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
    intro: 'Headquartered in the heart of Kalyan-Dombivli, Sonu Enterprises has spent over 15 years delivering turnkey home interiors across the twin cities. From sprawling family flats in Khadakpada to modern high-rises in Dombivli East, we combine immediate local presence with master-craftsmanship, direct factory modular manufacturing, and zero sub-contracting risk.',
    propertyTypes: [
      { name: 'Khadakpada Luxury Apartments (3BHK & 4BHK)', desc: 'Large format family residences demanding customized Italian marble layouts, false ceiling acoustic schemes, and grand living-dining zoning.' },
      { name: 'Dombivli East Modern 1BHK & 2BHK High-Rises', desc: 'Compact urban homes requiring maximum storage efficiency, floor-to-ceiling wardrobes, and parallel modular kitchens.' },
      { name: 'Standalone Row Houses & Bungalows', desc: 'Multi-level homes with custom staircases, private pooja sanctuaries, and terrace lounge makeovers.' }
    ],
    localChallenges: [
      { challenge: 'High humidity and monsoon moisture penetration', solution: 'We use 100% IS:710 Marine Grade BWP Plywood with PUR waterproof edge-banding, preventing carcass rot and swelling.' },
      { challenge: 'Strict society delivery timings and security checks', solution: 'Our local office coordinates all gate passes, debris carting, and supervisor schedules without project delays.' }
    ],
    process: [
      { step: '01', title: 'Immediate Same-Day Site Visit', desc: 'Our Kalyan-based team inspects your property within 24 hours for laser measurements.' },
      { step: '02', title: '3D Design & Local Showroom Material Selection', desc: 'Review 3D layouts and touch real wood, stone, and laminates at our local facility.' },
      { step: '03', title: 'Turnkey Execution & Local Support', desc: 'Dedicated site engineers oversee execution with instant local response.' }
    ],
    faqs: [
      { question: 'Where is your Kalyan-Dombivli office located?', answer: 'Our registered operational hub is located at Shop no. 22, Chandresh Godavari, Kalyan - Shilphata Rd, near Nilje station, Dombivli East, Palava City, Kalyan 421204.' },
      { question: 'Have you completed projects in Khadakpada and Dombivli East?', answer: 'Yes, we have executed dozens of turnkey residences in Khadakpada, Tilak Nagar, Godrej Hill, and throughout Dombivli over the past 15 years.' }
    ],
    projectIds: ['1', '3', '6']
  },
  {
    slug: 'palava-city',
    name: 'Palava City',
    suburbs: ['Lakeshore Greens', 'Casa Bella', 'Casa Bella Gold', 'Downton', 'Casa Rio', 'Casa Rio Gold', 'Prime Central'],
    seoTitle: 'Interior Designer in Palava City Dombivli | Sonu Enterprises',
    metaDescription: 'Premier interior designers for Palava City (Lodha) apartments. Custom modular kitchens, smart wardrobes & space-saving interiors. Located right at Nilje station.',
    h1: 'Interior Designers in Palava City',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80',
    intro: 'Located right next to Nilje station at the gateway to Palava City, Sonu Enterprises is the most established interior design firm for Lodha Palava homeowners. We understand the specific structural nuances, pipe shaft locations, balcony guidelines, and compact layout optimizations of Casa Bella, Casa Rio, Lakeshore Greens, and Downton towers.',
    propertyTypes: [
      { name: 'Palava 1BHK & 2BHK Smart Homes (450 - 750 sq. ft.)', desc: 'Compact floor plans that require ingenious dual-function joinery, hydraulic storage beds, and open-plan kitchen breakfast bars.' },
      { name: 'Palava 3BHK Family Residences (900 - 1250 sq. ft.)', desc: 'Spacious layouts optimized with full-wall TV consoles, master walk-in wardrobes, and Mandir alcoves.' }
    ],
    localChallenges: [
      { challenge: 'Strict Lodha Palava facility management regulations', solution: 'We hold complete documentation compliance, worker safety protocols, and daily clean-up standards required by Palava authorities.' },
      { challenge: 'Standardized pipe duct locations restricting kitchen re-routing', solution: 'Our specialized Palava-specific kitchen modules are pre-engineered to align seamlessly with building plumbing shafts without ugly exposed pipes.' }
    ],
    process: [
      { step: '01', title: 'Consultation at Our Palava/Nilje Office', desc: 'Drop by our office right outside Palava or request an immediate in-home consultation.' },
      { step: '02', title: 'Palava-Optimized 3D Floor Planning', desc: 'Pre-calibrated 3D templates for your exact cluster tower layout to accelerate design sign-off.' },
      { step: '03', title: 'Fast-Track Execution & Handover', desc: 'Average turnaround of 35-45 days with zero disruption to neighbors.' }
    ],
    faqs: [
      { question: 'Do you handle the Lodha Palava interior fit-out NOC and deposit formalities?', answer: 'Yes. We prepare the complete drawing package, contractor insurance papers, and coordinate with the Lodha estate management office for seamless gate passes.' },
      { question: 'How close is your office to Palava City?', answer: 'We are situated right at Chandresh Godavari on Kalyan-Shilphata Road, minutes from Lakeshore Greens and Casa Bella.' }
    ],
    projectIds: ['1']
  },
  {
    slug: 'thane',
    name: 'Thane',
    suburbs: ['Majiwada', 'Ghodbunder Road', 'Hiranandani Estate', 'Vasant Vihar', 'Pokhran Road 1 & 2', 'Kolshet Road', 'Panchpakhadi'],
    seoTitle: 'Interior Designer in Thane | Turnkey Flats & Luxury Homes | Sonu Enterprises',
    metaDescription: 'Expert interior designers in Thane West. Luxury turnkey solutions for high-rises in Hiranandani Estate, Majiwada, Ghodbunder Rd & Pokhran. 15+ years experience.',
    h1: 'Interior Designers in Thane',
    heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80',
    intro: 'Thane has evolved into one of the most vibrant luxury residential destinations in the Mumbai Metropolitan Region (MMR). From the iconic neoclassical towers of Hiranandani Estate and the sprawling townships of Ghodbunder Road to the upscale developments along Pokhran Road, Sonu Enterprises delivers sophisticated turnkey interiors that match Thane’s elevated lifestyle aspirations.',
    propertyTypes: [
      { name: 'Luxury High-Rise Condominiums (2BHK, 3BHK & 4BHK)', desc: 'High-ceiling homes in projects by Lodha, Rustomjee, Piramal, and Kalpataru requiring premium finishes and acoustic sound-proofing.' },
      { name: 'Duplexes & Penthouses', desc: 'Double-height ceiling designs, grand custom chandeliers, private terrace lounges, and architectural staircases.' }
    ],
    localChallenges: [
      { challenge: 'High wind load and rain exposure on upper floors (30th+ floor)', solution: 'Heavy-duty weather-sealed balcony enclosures, acoustic glass partitions, and specialized exterior hardware.' },
      { challenge: 'Complex society guidelines in gated communities', solution: 'Full adherence to Hiranandani, Lodha, and Raymond Realty society work timings, safety nets, and debris management.' }
    ],
    process: [
      { step: '01', title: 'On-Site Laser Survey in Thane', desc: 'Thorough spatial documentation, plumbing review, and electrical load audit.' },
      { step: '02', title: 'Virtual 3D Walkthrough & Samples', desc: 'Photorealistic 3D renders with Italian marble and veneer sample selections.' },
      { step: '03', title: 'Precision Factory Joinery & On-Site Assembly', desc: 'Pre-finished modular carcasses delivered ready for seamless installation.' }
    ],
    faqs: [
      { question: 'Have you worked on projects along Ghodbunder Road and Pokhran Road?', answer: 'Yes, we have executed multiple high-end residential interiors across Thane West, including Majiwada, Hiranandani Estate, and Pokhran Road.' },
      { question: 'Can you assist in sourcing Italian marble and luxury fittings in Thane?', answer: 'Yes. We guide clients directly to verified stone yards and sanitary ware showrooms, securing wholesale contractor pricing.' }
    ],
    projectIds: ['2']
  },
  {
    slug: 'navi-mumbai',
    name: 'Navi Mumbai',
    suburbs: ['Vashi', 'Kharghar', 'Nerul', 'Seawoods', 'Belapur', 'Ulwe', 'Sanpada', 'Airoli'],
    seoTitle: 'Interior Designer in Navi Mumbai | Vashi, Kharghar, Nerul | Sonu Enterprises',
    metaDescription: 'Leading interior design contractors in Navi Mumbai. Turnkey residential flats, commercial offices & modular kitchens in Vashi, Kharghar, Seawoods & Nerul.',
    h1: 'Interior Designers in Navi Mumbai',
    heroImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80',
    intro: 'Planned with spacious sectors and modern infrastructure, Navi Mumbai is home to discerning homeowners and booming commercial enterprises. Sonu Enterprises delivers tailored interior architecture across Vashi, Kharghar, Nerul, Seawoods, and Belapur—combining contemporary minimalism with robust coastal moisture protection.',
    propertyTypes: [
      { name: 'Spacious Residential Apartments (CIDCO & Private Towers)', desc: 'Well-ventilated 2BHK and 3BHK flats optimized with custom modular kitchens, Mandir rooms, and bedroom suites.' },
      { name: 'Commercial Corporate Offices & Tech Parks', desc: 'Acoustic glass cabins, open-plan desking, executive boardrooms, and reception lounges in Vashi and Belapur.' },
      { name: 'Sea-Facing Luxury Residences in Nerul & Palm Beach Rd', desc: 'Unobstructed panoramic window framing with low-profile minimalist furniture and imported stone.' }
    ],
    localChallenges: [
      { challenge: 'Saline coastal breeze causing hardware corrosion', solution: 'Exclusively using SS 304/316 grade stainless steel fittings, PVD coatings, and marine-grade plywood.' },
      { challenge: 'Balancing large open floor plans with cozy zoning', solution: 'Designing architectural ceiling transitions, acoustic wooden rafters, and mood-adaptive lighting.' }
    ],
    process: [
      { step: '01', title: 'Comprehensive Site Survey', desc: 'Precise measurements and analysis of natural light paths throughout the day.' },
      { step: '02', title: '3D Architectural Visuals', desc: 'Full-color photorealistic renders with material palette boards.' },
      { step: '03', title: 'Turnkey Execution with Strict Quality Checks', desc: 'Milestone-based delivery with weekly progress photo updates.' }
    ],
    faqs: [
      { question: 'Do you execute commercial office interiors in Navi Mumbai?', answer: 'Yes. We have completed numerous boutique corporate offices, retail spaces, and clinics in Vashi, Sanpada, and Belapur.' },
      { question: 'What is your warranty period on modular kitchen and wardrobe woodwork?', answer: 'We offer an authentic 10-year structural warranty against manufacturing defects and borer/termite infestation on all BWP marine ply joinery.' }
    ],
    projectIds: ['4']
  },
  {
    slug: 'bandra',
    name: 'Bandra & Khar',
    suburbs: ['Bandra West', 'Pali Hill', 'Carter Road', 'Bandstand', 'Bandra Kurla Complex (BKC)', 'Khar West'],
    seoTitle: 'Luxury Interior Designer in Bandra & Khar | Sonu Enterprises',
    metaDescription: 'High-end interior design for luxury sea-facing apartments, heritage villas & corporate suites in Bandra West, Pali Hill, Carter Road & BKC. Turnkey execution.',
    h1: 'Luxury Interior Designers in Bandra & Khar',
    heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80',
    intro: 'Bandra represents the pinnacle of Mumbai’s creative and cultural luxury. From the iconic sea-facing residences along Carter Road and Bandstand to the tranquil bungalows of Pali Hill and the high-octane corporate suites in BKC, Sonu Enterprises delivers bespoke, discreet, and world-class interior craftsmanship.',
    propertyTypes: [
      { name: 'Sea-Facing Luxury Condos', desc: 'Bespoke layouts engineered with corrosion-proof hardware, panoramic picture framing, and Italian marble.' },
      { name: 'Heritage Apartments & Redevelopment Flats', desc: 'Modernizing older colonial footprints into open-concept contemporary residences with high ceilings.' },
      { name: 'BKC Corporate & Executive Lounges', desc: 'Prestige meeting rooms, private executive cabins, and acoustic focus pods for finance and tech leaders.' }
    ],
    localChallenges: [
      { challenge: 'High sea-salt air accelerating corrosion', solution: 'We use 100% marine-grade hardware, anti-rust coatings, and specialized exterior glass sealing.' },
      { challenge: 'Severe parking and delivery constraints in narrow Bandra lanes', solution: 'Carefully staged night deliveries and coordinated logistics ensuring zero neighborhood disruption.' }
    ],
    process: [
      { step: '01', title: 'Discreet Private Consultation', desc: 'In-depth lifestyle briefing discussing aesthetic preferences, privacy, and timelines.' },
      { step: '02', title: 'Bespoke Concept & Material Curation', desc: 'Curating imported stones, custom brass accents, and fine fabrics.' },
      { step: '03', title: 'White-Glove Turnkey Execution', desc: 'Daily project oversight by senior site architects ensuring perfection.' }
    ],
    faqs: [
      { question: 'How do you handle intense sea breeze exposure in Bandra West flats?', answer: 'We install anodized aluminum sliding systems with EPDM gaskets, marine-grade SS 316 hardware, and anti-fungal moisture sealants.' },
      { question: 'Can you work within strict residential society working hour limits in Bandra?', answer: 'Yes. We strictly respect local quiet hours and deploy prefabricated factory modular components to minimize on-site noise.' }
    ],
    projectIds: ['2', '5']
  },
  {
    slug: 'andheri',
    name: 'Andheri & Juhu',
    suburbs: ['Lokhandwala', 'Andheri West', 'Versova', 'Juhu', 'Andheri East', 'JB Nagar', 'Chakala'],
    seoTitle: 'Interior Designer in Andheri & Juhu | Sonu Enterprises',
    metaDescription: 'Premier interior design services in Andheri West, Lokhandwala, Juhu & Andheri East. Bespoke residences, media studios & smart apartments. 15+ years experience.',
    h1: 'Interior Designers in Andheri & Juhu',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
    intro: 'Andheri and Juhu embody the creative pulse of Mumbai’s entertainment, media, and commerce industries. From celebrity residences in Juhu and high-energy luxury flats in Lokhandwala Complex to dynamic media production offices in Andheri East, Sonu Enterprises brings flair, acoustic precision, and speed of execution to every project.',
    propertyTypes: [
      { name: 'Lokhandwala & Versova Residences (2BHK, 3BHK & Duplexes)', desc: 'Trendy, photogenic interiors featuring fluted glass, neon accents, acoustic media units, and luxury walk-in wardrobes.' },
      { name: 'Juhu Sea-Side Luxury Apartments', desc: 'Expansive private sanctuaries using organic textures, Italian marble, and tranquil balcony decks.' },
      { name: 'Andheri East Boutique Studios & Creative Offices', desc: 'Acoustic edit suites, collaborative open desks, and executive lounges.' }
    ],
    localChallenges: [
      { challenge: 'Acoustic noise from metro lines and airport flight paths', solution: 'We install multi-chamber acoustic false ceilings and soundproof double-glazed window systems.' },
      { challenge: 'Compact redevelopment flat layouts in older societies', solution: 'Creating open-plan living-kitchen layouts that visually double perceived room volume.' }
    ],
    process: [
      { step: '01', title: 'Laser Site Inspection & Acoustic Audit', desc: 'Analyzing external ambient noise levels and room dimensions.' },
      { step: '02', title: 'Creative 3D Rendering & Material Board', desc: 'Custom mood boards featuring contemporary materials and ambient lighting.' },
      { step: '03', title: 'Fast-Track Turnkey Delivery', desc: 'Scheduled milestone deliveries ensuring on-time handover.' }
    ],
    faqs: [
      { question: 'Can you soundproof a room for podcasting or music in an Andheri apartment?', answer: 'Yes. We install professional acoustic decoupling, rockwool dampening, and acoustic fabric panels to isolate external sound.' },
      { question: 'Do you execute commercial office interiors in Andheri East?', answer: 'Yes. We handle commercial fit-outs across MIDC, Chakala, and Sakinaka.' }
    ],
    projectIds: ['4', '5']
  },
  {
    slug: 'powai',
    name: 'Powai & Chandivali',
    suburbs: ['Hiranandani Gardens', 'Chandivali', 'Raheja Vihar', 'Saki Vihar Road', 'Kailash Complex', 'Nahur'],
    seoTitle: 'Interior Designer in Powai & Chandivali | Sonu Enterprises',
    metaDescription: 'Top interior designers in Powai (Hiranandani Gardens & Chandivali). Modern European aesthetic, smart home automation & luxury kitchens for tech & finance leaders.',
    h1: 'Interior Designers in Powai & Chandivali',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
    intro: 'Overlooking the serene waters of Powai Lake, Powai is renowned for the grand neoclassical architecture of Hiranandani Gardens and modern high-rises in Chandivali. Serving IIT alumni, tech entrepreneurs, and multinational executives, Sonu Enterprises designs interiors that blend European elegance with smart home automation and ergonomic work-from-home suites.',
    propertyTypes: [
      { name: 'Hiranandani Gardens Heritage High-Rises', desc: 'Neoclassical homes enhanced with decorative wall mouldings, coffered ceilings, and classical chandeliers.' },
      { name: 'Chandivali Modern High-Rise Condos', desc: 'Sleek minimalist aesthetics with hidden storage, handleless modular kitchens, and balcony gardens.' }
    ],
    localChallenges: [
      { challenge: 'High tech integration requirements', solution: 'Concealed CAT6 data cabling, smart switch modules, motorized curtains, and voice-controlled lighting.' },
      { challenge: 'Strict preservation of external facade aesthetics in Hiranandani', solution: 'Designing internal window treatments and balcony enclosures that comply 100% with estate rules.' }
    ],
    process: [
      { step: '01', title: 'Detailed Needs Assessment in Powai', desc: 'Understanding smart automation, WFH, and family lifestyle requirements.' },
      { step: '02', title: 'Neoclassical & Contemporary 3D Designs', desc: 'Visualizing mouldings, lighting channels, and custom furniture pieces.' },
      { step: '03', title: 'Seamless Turnkey Handover', desc: 'Rigorous 120-point quality audit prior to moving in.' }
    ],
    faqs: [
      { question: 'Can you integrate smart home automation with existing electrical setups in Powai?', answer: 'Yes. We integrate wireless smart retro-fit modules (compatible with Alexa, Google Home, and Apple HomeKit) that require zero wall tearing.' },
      { question: 'Have you worked in Hiranandani Gardens towers?', answer: 'Yes, we are thoroughly familiar with Hiranandani property guidelines, ceiling heights, and plumbing stack layouts.' }
    ],
    projectIds: ['2', '5']
  }
];

// ==========================================
// VALUE-PACKED BLOG POSTS & GUIDES
// ==========================================

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-interior-designer-mumbai',
    title: 'How to Choose an Interior Designer in Mumbai (Checklist, Fees & Red Flags)',
    seoTitle: 'How to Choose an Interior Designer in Mumbai | 2026 Guide & Fees | Sonu Enterprises',
    metaDescription: 'A practical, honest guide to choosing the right interior designer in Mumbai. Compare turnkey vs design-only, understand realistic fee structures, and avoid costly red flags.',
    h1: 'How to Choose an Interior Designer in Mumbai (Checklist, Fees & Red Flags)',
    category: 'Guides & Advice',
    publishedDate: 'January 15, 2026',
    readTime: '8 min read',
    author: {
      name: 'Sonu Enterprises Design Studio',
      role: 'Principal Architectural Team'
    },
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    excerpt: 'Selecting the right interior partner for your Mumbai home can save you lakhs of rupees and months of anxiety. Here is what every homeowner must verify before signing a contract.',
    tableOfContents: [
      { id: 'turnkey-vs-consultant', title: '1. Turnkey Contractor vs. Design-Only Consultant' },
      { id: 'fee-structures', title: '2. Understanding Interior Design Fee Models in Mumbai' },
      { id: 'critical-checklist', title: '3. The 7-Point Verification Checklist' },
      { id: 'red-flags', title: '4. Major Red Flags to Watch Out For' },
      { id: 'society-compliance', title: '5. Navigating Mumbai Society Guidelines & Permissions' }
    ],
    sections: [
      {
        id: 'turnkey-vs-consultant',
        heading: '1. Turnkey Contractor vs. Design-Only Consultant',
        content: [
          'When embarking on an interior design journey in Mumbai, you will primarily encounter two operating models: Design-Only Consultants and Turnkey Design & Build Contractors.',
          'Design-Only consultants charge a fee (typically ₹100 - ₹300 per sq. ft.) to produce 2D drawings and 3D renders. However, the client is left with the exhausting task of hiring independent carpenters, electricians, plumbers, and painters, while mediating disputes when the drawing doesn’t match site realities.',
          'Turnkey Contractors (like Sonu Enterprises) take single-point responsibility for everything: initial 3D visualization, material procurement, factory modular manufacturing, on-site civil works, electrical, plumbing, painting, and final deep cleaning. This guarantees that your agreed budget and timeline are honored with zero contractor blame-shifting.'
        ]
      },
      {
        id: 'fee-structures',
        heading: '2. Understanding Interior Design Fee Models in Mumbai',
        content: [
          'In the Mumbai Metropolitan Region (MMR), interior pricing varies significantly based on material specifications:',
          '• Basic Tier (Commercial Ply + Standard Laminate): ₹1,100 to ₹1,400 per sq. ft. of carpet area.',
          '• Premium Tier (IS:710 Marine Ply + Acrylic / Quartz + Concealed Lighting): ₹1,500 to ₹2,200 per sq. ft.',
          '• Luxury Tier (Imported Marble + Veneer + PU Lacquer + Smart Automation): ₹2,500 to ₹4,500+ per sq. ft.',
          'Always insist on a comprehensive Bill of Quantities (BOQ) that clearly specifies the plywood grade (e.g., IS:710 BWP vs Commercial MR), laminate thickness (1mm vs 0.8mm), and hardware brands (Blum/Hettich vs unbranded).'
        ]
      },
      {
        id: 'critical-checklist',
        heading: '3. The 7-Point Verification Checklist Before You Sign',
        content: [
          'Before transferring any advance deposit, verify these seven essential credentials:',
          '1. Physical Workshop or Office: Ensure the firm has a real, verifiable office or manufacturing unit you can visit.',
          '2. Active On-Site Projects: Ask to visit a current live site in progress. A finished showroom only shows what is possible; a live site reveals their cleanliness, craftsmanship, and safety protocols.',
          '3. Brand Authenticity: Confirm they provide invoices and warranty cards for hardware (Blum, Hettich) and plywood.',
          '4. Payment Milestone Structure: Never pay more than 10-15% as a booking advance. Healthy payment schedules tie payments to clear milestones (e.g., 30% upon carcass delivery, 30% upon installation, 10% upon final snag completion).',
          '5. Society NOC Assistance: Confirm whether they handle structural drawings and security documentation for your housing society.',
          '6. In-House Labor vs. Sub-contracting: Ensure your project will be supervised by regular, trained site supervisors rather than outsourced to third-party sub-contractors.',
          '7. Written Timeline Guarantee: Secure a clear contractual handover date with penalties for unexcused delays.'
        ]
      },
      {
        id: 'red-flags',
        heading: '4. Major Red Flags to Watch Out For',
        content: [
          '• Unrealistically Low Estimates: If one contractor quotes ₹6 Lakhs for a 2BHK while three others quote ₹10-12 Lakhs, they will either use inferior commercial board that rots in monsoon humidity or introduce massive "hidden extra" charges halfway through.',
          '• Refusal to Name Specific Material Brands: Vague descriptions like "heavy-duty waterproof plywood" instead of "Century / Greenply IS:710 BWP Marine Plywood".',
          '• No Written Contract: Never proceed on verbal assurances or WhatsApp chat summaries alone.'
        ]
      },
      {
        id: 'society-compliance',
        heading: '5. Navigating Mumbai Society Guidelines & Permissions',
        content: [
          'Mumbai housing societies maintain strict rules regarding interior modifications: working hours are restricted (typically 10 AM to 6 PM, with strict Sunday bans on noise), core-cutting of structural beams/columns is strictly prohibited, and debris must be carted away in authorized covered trucks.',
          'An experienced local interior team handles these permissions proactively, ensuring your relationship with new neighbors remains warm and cordial.'
        ]
      }
    ],
    faqs: [
      { question: 'What is the standard advance payment required to start interior work?', answer: 'A reputable firm will ask for 10% to 15% as a token booking deposit to prepare 3D models and 2D working drawings, followed by progressive milestone payments.' },
      { question: 'Can an interior designer help reduce my costs without sacrificing quality?', answer: 'Yes. An experienced designer will suggest smart value-engineering—such as using premium veneer on high-visibility living room accent walls while using durable, affordable laminates inside wardrobe carcasses.' }
    ]
  },
  {
    slug: 'modern-flat-interior-design-ideas-mumbai',
    title: 'Modern Flat Interior Design Ideas for Mumbai Homes (Maximizing Compact Space)',
    seoTitle: 'Modern Flat Interior Design Ideas Mumbai | Space-Saving Solutions | Sonu Enterprises',
    metaDescription: '12 innovative flat interior design ideas for modern Mumbai apartments. Clever space planning, concealed storage, floating furniture & lighting tricks to make compact rooms look expansive.',
    h1: 'Modern Flat Interior Design Ideas for Mumbai Homes (Maximizing Compact Space)',
    category: 'Design Ideas',
    publishedDate: 'February 2, 2026',
    readTime: '7 min read',
    author: {
      name: 'Sonu Enterprises Design Studio',
      role: 'Principal Architectural Team'
    },
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    excerpt: 'Living in a Mumbai apartment often means making every square inch count. Here are 12 modern architectural ideas to maximize floor space without sacrificing luxury.',
    tableOfContents: [
      { id: 'visual-flow', title: '1. Establish Continuous Visual Flooring' },
      { id: 'floating-furniture', title: '2. The Power of Floating Furniture' },
      { id: 'mirrors-glass', title: '3. Strategic Tinted Mirrors & Fluted Glass' },
      { id: 'vertical-storage', title: '4. Floor-to-Ceiling Vertical Storage' },
      { id: 'concealed-lighting', title: '5. Layered Cove & Architectural Lighting' }
    ],
    sections: [
      {
        id: 'visual-flow',
        heading: '1. Establish Continuous Visual Flooring',
        content: [
          'In compact 1BHK and 2BHK Mumbai flats, chopping up the floor with different tiles in every room visually shrinks your home. Use continuous large-format tiles (e.g., 4x2 ft or 6x4 ft vitrified slabs) with matching epoxy grout lines flowing unbroken from the foyer through the living, dining, and passage areas.',
          'This eliminates visual thresholds and tricks the eye into perceiving the entire apartment as one expansive, continuous volume.'
        ]
      },
      {
        id: 'floating-furniture',
        heading: '2. The Power of Floating Furniture',
        content: [
          'Heavy furniture with solid plinths that sit flat on the floor blocks sightlines and traps dust. Instead, mount your TV console, vanity cabinets, bedside tables, and even prayer units to the wall, leaving 8 to 12 inches of open floor space underneath.',
          'When the human brain sees uninterrupted floor stretching to the perimeter wall, the room immediately feels significantly larger and lighter.'
        ]
      },
      {
        id: 'mirrors-glass',
        heading: '3. Strategic Tinted Mirrors & Fluted Glass',
        content: [
          'Mirrors are a classic space-multiplying device, but plain silver mirrors can feel cold. Use bronze or grey tinted mirrors behind your dining table or on wardrobe shutters to reflect ambient light while maintaining cozy sophistication.',
          'Replace solid wooden partition doors with black aluminum-framed fluted glass sliding panels. Fluted glass lets natural sunlight filter between rooms while blurring visual clutter for complete privacy.'
        ]
      },
      {
        id: 'vertical-storage',
        heading: '4. Floor-to-Ceiling Vertical Storage',
        content: [
          'Avoid standard 7-foot wardrobes that leave 2 to 3 feet of dead space on top—which inevitably collects dust and random suitcases. Extend all wardrobes, kitchen cabinets, and foyer storage to the true ceiling slab.',
          'Use the top loft zone for rarely used items like monsoon bedding, extra luggage, and festive decor, freeing up your daily living zones from clutter.'
        ]
      },
      {
        id: 'concealed-lighting',
        heading: '5. Layered Cove & Architectural Lighting',
        content: [
          'Relying on a single bright white tube light in the center of the ceiling creates harsh downward shadows and draws the walls inward. Instead, install perimeter false ceiling coves with 3000K warm-white indirect LED ribbons.',
          'Bouncing soft light off the ceiling and walls washes the perimeter in gentle illumination, making the room boundaries feel expansive and welcoming.'
        ]
      }
    ],
    faqs: [
      { question: 'What color palette is best for making small Mumbai flats look bigger?', answer: 'Warm light neutrals—such as ivory, warm grey, greige, and soft taupe—reflect maximum ambient light while feeling cozy. Add depth through contrasting dark wood or brass accents.' },
      { question: 'Are open kitchens practical in Indian households with intense tadka?', answer: 'Yes, provided you install a high-suction chimney (1200+ m3/hr) and glass sliding partitions that can be closed during intense frying and opened during entertaining.' }
    ]
  },
  {
    slug: 'modular-kitchen-design-ideas-mumbai-apartments',
    title: 'Modular Kitchen Design Ideas for Mumbai Apartments (Layouts, Moisture Protection & Storage)',
    seoTitle: 'Modular Kitchen Design Mumbai | Waterproof Layouts & Storage | Sonu Enterprises',
    metaDescription: 'Essential guide to designing a modular kitchen in Mumbai flats. BWP marine ply benefits, Work Triangle layouts, anti-moisture sealing & smart corner storage solutions.',
    h1: 'Modular Kitchen Design Ideas for Mumbai Apartments (Layouts, Moisture Protection & Storage)',
    category: 'Kitchens',
    publishedDate: 'February 18, 2026',
    readTime: '9 min read',
    author: {
      name: 'Sonu Enterprises Design Studio',
      role: 'Principal Architectural Team'
    },
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
    excerpt: 'Mumbai kitchens face intense heat, spices, and coastal monsoon humidity. Learn how to engineer a durable, ergonomic modular kitchen that lasts 15+ years.',
    tableOfContents: [
      { id: 'material-truth', title: '1. The Truth About Kitchen Materials: Why Only IS:710 BWP Ply Works' },
      { id: 'work-triangle', title: '2. Mastering the Kitchen Work Triangle in Compact Layouts' },
      { id: 'storage-hacks', title: '3. Space-Saving Corner & Pantry Storage Hacks' },
      { id: 'countertops', title: '4. Countertop Showdown: Quartz vs. Indian Granite' },
      { id: 'monsoon-prep', title: '5. Waterproofing & Anti-Pest Details' }
    ],
    sections: [
      {
        id: 'material-truth',
        heading: '1. The Truth About Kitchen Materials: Why Only IS:710 BWP Ply Works',
        content: [
          'Many factory-made branded modular kitchen startups deliver carcasses constructed from particle board, MDF, or Commercial MR plywood. In Mumbai, where relative humidity routinely reaches 85-90% during monsoons, and water leaks around sinks are common, particle board absorbs moisture, swells like a sponge, and begins crumbling within 2 to 3 years.',
          'At Sonu Enterprises, all kitchen under-counter and sink carcasses are constructed exclusively with IS:710 Boiling Waterproof (BWP) calibrated Marine Plywood. BWP plywood uses synthetic phenolic resins that withstand 72+ hours of continuous boiling water immersion without delamination.'
        ]
      },
      {
        id: 'work-triangle',
        heading: '2. Mastering the Kitchen Work Triangle in Compact Layouts',
        content: [
          'The golden rule of kitchen ergonomics is the Work Triangle connecting the Sink (Wash), Cooktop (Cook), and Refrigerator (Prep). The sum of all three sides should ideally be between 12 and 26 feet.',
          '• Parallel / Galley Kitchens: The undisputed champion for narrow Mumbai apartment layouts. Place the hob and refrigerator on one platform, and the sink on the opposite platform. This separates wet preparation from dry cooking.',
          '• L-Shaped Kitchen: Perfect for square or open-plan kitchens, providing generous counter space while leaving room for an integrated breakfast ledge.'
        ]
      },
      {
        id: 'storage-hacks',
        heading: '3. Space-Saving Corner & Pantry Storage Hacks',
        content: [
          'Deep corner cabinets often turn into dark voids where cooking pots are forgotten. Install German magic corner carousels or LeMans pull-out trays that swing all stored items out into the room with a single pull.',
          'Incorporate a 6-inch slim pull-out spice rack right beside the stove for daily cooking oils and masalas, and install tandem drawers instead of deep cabinets for effortless overhead visibility of utensils.'
        ]
      },
      {
        id: 'countertops',
        heading: '4. Countertop Showdown: Quartz vs. Indian Granite',
        content: [
          '• Jet Black / Telephone Black Granite: Exceptional heat resistance (you can place hot tawa pans directly on it), scratch-proof, and budget-friendly. However, it offers limited color variety and requires experienced stone fabricators for seamless sink cutouts.',
          '• Premium Engineered Quartz: Composed of 93% crushed natural quartz with polymer resins. Non-porous, highly resistant to turmeric and lemon acid stains, available in stunning marble-like patterns, and offers modern mitered edge detailing.'
        ]
      },
      {
        id: 'monsoon-prep',
        heading: '5. Waterproofing & Anti-Pest Details',
        content: [
          'Mount base kitchen modules on heavy-duty waterproof PVC legs covered by a removable front skirting panel, ensuring that washing the kitchen floor never brings water into contact with wooden carcasses.',
          'Apply antibacterial sanitary silicone along all joints between the countertop and tiled backsplash to stop water trickling behind cabinets.'
        ]
      }
    ],
    faqs: [
      { question: 'Can I put hot pots and pans directly onto a quartz countertop?', answer: 'While quartz is heat-resistant, sudden thermal shock from a scorching pan can damage the resin binding. Always use a trivet or silicone mat on quartz surfaces.' },
      { question: 'What is the standard height of a modular kitchen platform in India?', answer: 'Between 32 and 34 inches from the finished floor, tailored to the primary cook’s height to prevent back strain during long food preparation sessions.' }
    ]
  },
  {
    slug: 'space-saving-interior-ideas-mumbai-1bhk-2bhk',
    title: 'Space-Saving Interior Design Ideas for Mumbai 1BHK & 2BHK Apartments',
    seoTitle: 'Space-Saving Interior Design Mumbai | 1BHK & 2BHK Flats | Sonu Enterprises',
    metaDescription: 'Maximize your compact 1BHK or 2BHK flat in Mumbai. Multi-functional furniture, hydraulic storage beds, sliding partitions & custom carpentry ideas that double living space.',
    h1: 'Space-Saving Interior Design Ideas for Mumbai 1BHK & 2BHK Apartments',
    category: 'Space Optimization',
    publishedDate: 'March 1, 2026',
    readTime: '8 min read',
    author: {
      name: 'Sonu Enterprises Design Studio',
      role: 'Principal Architectural Team'
    },
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200&q=80',
    excerpt: 'When carpet area is premium, smart engineering is non-negotiable. Discover architectural tricks and custom carpentry solutions that unlock massive storage in compact Mumbai apartments.',
    tableOfContents: [
      { id: 'dual-purpose', title: '1. Dual-Purpose Multi-Functional Joinery' },
      { id: 'hydraulic-beds', title: '2. Heavy-Duty Hydraulic Storage Beds' },
      { id: 'sliding-systems', title: '3. Pocket & Sliding Doors vs. Swing Clearance' },
      { id: 'balcony-merging', title: '4. Balcony Integration & Window Ledge Seating' },
      { id: 'foyer-drop', title: '5. Multi-Functional Foyer Drop Zones' }
    ],
    sections: [
      {
        id: 'dual-purpose',
        heading: '1. Dual-Purpose Multi-Functional Joinery',
        content: [
          'In a 500 to 750 sq. ft. Mumbai apartment, every piece of furniture should perform at least two functions. For example: a dining table that folds down flush against a wall when not in use, a living room sectional sofa with integrated deep blanket storage underneath, or an entertainment console that extends into an ergonomic laptop workstation.',
          'By designing bespoke built-in units rather than purchasing rigid loose store-bought furniture, you eliminate awkward dead corners and capture 25% more usable floor area.'
        ]
      },
      {
        id: 'hydraulic-beds',
        heading: '2. Heavy-Duty Hydraulic Storage Beds',
        content: [
          'A king-size bed occupies roughly 40 square feet of floor space. Underneath is a massive storage volume equivalent to an entire 6-door wardrobe. Manual drawer beds are inconvenient in tight bedrooms because you need 3 feet of open clearance on either side to pull out the drawers.',
          'Custom hydraulic lift-up beds, fitted with 100kg+ gas pistons matched to the mattress weight, allow you to lift the entire mattress with one finger and access deep, compartmentalized storage for suitcases, blankets, and seasonal gear.'
        ]
      },
      {
        id: 'sliding-systems',
        heading: '3. Pocket & Sliding Doors vs. Swing Clearance',
        content: [
          'A standard hinged bedroom or bathroom door requires an unobstructed 3-foot radius arc of dead floor space just to open and close. That is 9 square feet of floor area rendered unusable.',
          'Installing top-hung sliding barn doors or pocket doors that slide inside false gypsum partitions recovers that floor space for furniture placement and smoother room circulation.'
        ]
      },
      {
        id: 'balcony-merging',
        heading: '4. Balcony Integration & Window Ledge Seating',
        content: [
          'If your society permissions allow enclosing or weather-sealing balconies, merge the balcony volume into the living room or bedroom. Create an upholstered window bay seat with built-in storage drawers below.',
          'It provides a sunny reading corner, additional seating for guests, and storage for books or board games without eating into room walking space.'
        ]
      },
      {
        id: 'foyer-drop',
        heading: '5. Multi-Functional Foyer Drop Zones',
        content: [
          'Even in compact flats, an entrance drop zone prevents clutter from migrating into the living room. Build a shallow 10-inch deep console cabinet near the front door incorporating a shoe rack, key bowl, umbrella holder, and a full-length mirror that lets you check your attire before leaving.'
        ]
      }
    ],
    faqs: [
      { question: 'Is custom furniture better than buying readymade furniture for small flats?', answer: 'Custom built-in furniture is vastly superior for small flats because it is built to the exact millimeter dimensions of your walls, eliminating wasted gaps that gather dust.' },
      { question: 'How much extra does hydraulic storage add to a custom bed?', answer: 'Installing heavy-duty German gas pistons and reinforced framing typically adds only ₹8,000 to ₹12,000 to a bed build while delivering huge storage utility.' }
    ]
  },
  {
    slug: '2bhk-interior-design-guide-mumbai-homeowners',
    title: '2BHK Interior Design Guide for Mumbai Homeowners: Timeline, Process & Key Decisions',
    seoTitle: '2BHK Interior Design Guide Mumbai | Cost, Timeline & Process | Sonu Enterprises',
    metaDescription: 'Complete 2BHK interior design handbook for Mumbai flat owners. Step-by-step timeline, realistic budgets, key decision milestones & turnkey contractor selection.',
    h1: '2BHK Interior Design Guide for Mumbai Homeowners: Timeline, Process & Key Decisions',
    category: 'Guides & Advice',
    publishedDate: 'March 10, 2026',
    readTime: '10 min read',
    author: {
      name: 'Sonu Enterprises Design Studio',
      role: 'Principal Architectural Team'
    },
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    excerpt: 'A comprehensive roadmap for renovating or fitting out a 2BHK flat in Mumbai: from keys handover and society permissions to material selections and final styling.',
    tableOfContents: [
      { id: 'stage-1-planning', title: 'Stage 1: Keys Handover & Laser Survey (Days 1–5)' },
      { id: 'stage-2-3d-design', title: 'Stage 2: 3D Visualization & BOQ Sign-off (Days 6–15)' },
      { id: 'stage-3-civil-mep', title: 'Stage 3: Society NOC, Civil & MEP Work (Days 16–25)' },
      { id: 'stage-4-carpentry', title: 'Stage 4: Modular Factory Fabrication & Carpentry (Days 26–45)' },
      { id: 'stage-5-finishing', title: 'Stage 5: Painting, Polish, Audit & Handover (Days 46–60)' }
    ],
    sections: [
      {
        id: 'stage-1-planning',
        heading: 'Stage 1: Keys Handover & Laser Survey (Days 1–5)',
        content: [
          'The moment you receive possession of your 2BHK flat, resist the urge to buy loose items immediately. The first step is a comprehensive laser spatial survey to measure every wall, beam depth, window sill height, and existing electrical/plumbing junction.',
          'During this initial stage, formulate your lifestyle brief: How many people will reside here? Do you work from home? What are your cooking habits? Do you need a dedicated Mandir or prayer unit?'
        ]
      },
      {
        id: 'stage-2-3d-design',
        heading: 'Stage 2: 3D Visualization & BOQ Sign-off (Days 6–15)',
        content: [
          'Work with your designer to review 2D space plans followed by photorealistic 3D renders. This is the stage to experiment with color themes, stone textures, and false ceiling designs.',
          'Never start civil demolition without a locked Bill of Quantities (BOQ) detailing explicit material brands, sheet thicknesses, and hardware models. Making design changes on-site during active carpentry invariably causes budget overruns and delays.'
        ]
      },
      {
        id: 'stage-3-civil-mep',
        heading: 'Stage 3: Society NOC, Civil & MEP Work (Days 16–25)',
        content: [
          'Submit contractor paperwork, security deposits, and layout drawings to the housing society office. Once gate passes are cleared, civil work commences:',
          '• Chipping and chasing walls for concealed electrical conduits (AC copper lines, TV cables, extra bedside sockets).',
          '• Plumbing line repositioning and mandatory 72-hour bathroom waterproofing tests.',
          '• Heavy-gauge galvanized GI false ceiling framework and wiring distribution.'
        ]
      },
      {
        id: 'stage-4-carpentry',
        heading: 'Stage 4: Modular Factory Fabrication & Carpentry (Days 26–45)',
        content: [
          'Parallel execution saves weeks: while civil plastering and ceiling joint taping happen on-site, modular kitchen and wardrobe carcasses are fabricated under clean, controlled factory conditions using precision CNC edge-banding and calibrated BWP marine ply.',
          'Once paint primer is completed, modular modules arrive on-site for rapid assembly, fitting of soft-close hardware, and quartz countertop installation.'
        ]
      },
      {
        id: 'stage-5-finishing',
        heading: 'Stage 5: Painting, Polish, Audit & Handover (Days 46–60)',
        content: [
          'The final fortnight focuses on delicate finishes: wallpaper application, PU lacquer polishing, switchboard faceplate installation, light fixture hookups, and curtain drapery.',
          'A rigorous 120-point quality audit is conducted—testing every drawer slide, water pressure point, and electrical socket—followed by industrial deep cleaning before handing you the keys to your dream home.'
        ]
      }
    ],
    faqs: [
      { question: 'What is a realistic budget for a complete 2BHK turnkey interior in Mumbai?', answer: 'For a 650-750 sq. ft. carpet 2BHK using genuine BWP marine ply, modular kitchen with quartz, false ceiling, and full painting, expect ₹9.5 Lakhs to ₹14 Lakhs for a high-quality, long-lasting finish.' },
      { question: 'Can 2BHK interior work be completed in 30 days?', answer: 'A high-quality turnkey project requires proper curing time for plaster, waterproofing ponding tests, and multi-coat paint drying. 45 to 60 working days is the realistic timeline for durable, blister-free execution.' }
    ]
  },
  {
    slug: 'interior-design-checklist-new-mumbai-flat',
    title: 'Interior Design Checklist for a New Mumbai Flat (Before Handover to After Move-in)',
    seoTitle: 'New Flat Interior Checklist Mumbai | Snagging to Move-In | Sonu Enterprises',
    metaDescription: 'The ultimate checklist for new Mumbai flat owners. Essential snag list inspections, society permissions, electrical planning, waterproofing checks & moving day tips.',
    h1: 'Interior Design Checklist for a New Mumbai Flat (Before Handover to After Move-in)',
    category: 'Checklists',
    publishedDate: 'March 18, 2026',
    readTime: '7 min read',
    author: {
      name: 'Sonu Enterprises Design Studio',
      role: 'Principal Architectural Team'
    },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    excerpt: 'Before taking possession from the builder and starting interior renovations, run through this comprehensive technical snag list to protect your investment.',
    tableOfContents: [
      { id: 'pre-possession-snags', title: 'Phase 1: Pre-Possession Builder Snag List' },
      { id: 'electrical-plumbing-audit', title: 'Phase 2: Electrical & Plumbing Layout Audit' },
      { id: 'interior-planning-checks', title: 'Phase 3: Interior Planning & Society NOCs' },
      { id: 'on-site-monitoring', title: 'Phase 4: Active Site Monitoring Points' },
      { id: 'handover-signoff', title: 'Phase 5: Final Handover & Move-In Protocol' }
    ],
    sections: [
      {
        id: 'pre-possession-snags',
        heading: 'Phase 1: Pre-Possession Builder Snag List',
        content: [
          'Before signing builder acceptance papers, inspect these critical items during daylight:',
          '• Check hollow sounds in floor tiles by tapping lightly with a wooden mallet.',
          '• Inspect window aluminum frame alignment for water leakage during monsoons.',
          '• Check exterior wall moisture levels using a digital moisture meter.',
          '• Inspect all bathroom floor slopes toward drains to ensure zero standing water.'
        ]
      },
      {
        id: 'electrical-plumbing-audit',
        heading: 'Phase 2: Electrical & Plumbing Layout Audit',
        content: [
          'Standard builder electrical points rarely align with modern interior furniture layouts. Check and plan for:',
          '• Two bedside two-way switches and phone charging sockets on both sides of master and guest beds.',
          '• Dedicated 16A power points for microwave, OTG, refrigerator, water purifier, and high-suction chimney in the kitchen.',
          '• Concealed copper piping routes for split ACs with proper gravity slope for water drainage.'
        ]
      },
      {
        id: 'interior-planning-checks',
        heading: 'Phase 3: Interior Planning & Society NOCs',
        content: [
          '• Obtain society bye-laws on interior work timings, elevator usage fees, and debris carting.',
          '• Lock your 3D designs and detailed material specifications (plywood grade, laminate thickness, hardware brands).',
          '• Ensure contractor provides worker insurance and indemnity bonds required by society security.'
        ]
      },
      {
        id: 'on-site-monitoring',
        heading: 'Phase 4: Active Site Monitoring Points',
        content: [
          '• Verify plywood stamps upon delivery (confirming IS:710 Marine Grade markings).',
          '• Confirm 72-hour pond testing for bathroom waterproofing before tiling begins.',
          '• Check that all concealed electrical cables run inside rigid or flexible PVC conduits.'
        ]
      },
      {
        id: 'handover-signoff',
        heading: 'Phase 5: Final Handover & Move-In Protocol',
        content: [
          '• Test every soft-close hinge, drawer runner, and sliding door damper.',
          '• Verify water pressure at all taps, health faucets, and diverters.',
          '• Collect all warranty certificates (appliances, hardware, and contractor guarantee).',
          '• Complete industrial chemical-free deep cleaning before unpacking personal belongings.'
        ]
      }
    ],
    faqs: [
      { question: 'What is a snag list in interior construction?', answer: 'A snag list is an itemized inventory of minor defects, scratches, loose fittings, or misalignments that must be rectified before final client sign-off.' },
      { question: 'Why should AC piping be done before false ceiling and painting?', answer: 'AC copper tubes and drain pipes must be concealed inside walls and ceilings. Doing this after painting causes messy wall gouging and mismatched paint patches.' }
    ]
  }
];

// ==========================================
// REAL PROJECTS & TESTIMONIALS (NO FAKE DATA)
// ==========================================

export const PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'modern-minimalist-apartment',
    title: 'Modern Minimalist 3BHK Residence',
    location: 'Palava City, Kalyan',
    city: 'Kalyan-Dombivli',
    category: ProjectCategory.RESIDENTIAL,
    type: 'Apartment',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80',
    description: 'Turnkey 3BHK interior transformation in Palava City featuring seamless open-plan living, custom IS:710 BWP modular kitchen with quartz counters, floor-to-ceiling sliding wardrobes, and perimeter cove lighting.',
    shortDescription: 'Complete 3BHK interior in Palava City with minimalist aesthetics, modular kitchen, and smart space planning.',
    problem: 'The client needed maximum storage and an uncluttered visual feel in a standard high-rise flat layout with limited natural light in the central corridor.',
    designGoal: 'Create an airy, Scandinavian-inspired modern minimalist home using light oak veneers, warm white 3000K indirect coves, and floating storage to maintain floor continuity.',
    materialsUsed: ['IS:710 Marine Grade Plywood', 'CenturyPly 1mm Matte Laminates', 'Engineered White Quartz', 'Saint-Gobain Gyproc false ceiling'],
    keyFeatures: [
      'Parallel modular kitchen with Blum soft-close tandem boxes',
      'Floating entertainment console with hidden cable management',
      'Hydraulic king bed with internal dust-proof storage',
      'Perimeter warm cove lighting throughout living and bedrooms'
    ],
    area: '1,180 sq. ft.',
    duration: '52 Days',
    year: '2024',
    completionDate: '2024',
    isFeatured: true,
    showOnHome: true,
    gallery: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'
    ]
  },
  {
    id: '2',
    slug: 'luxury-penthouse-design',
    title: 'Luxury High-Rise Penthouse',
    location: 'Thane West',
    city: 'Thane',
    category: ProjectCategory.LUXURY,
    type: 'Apartment',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1920&q=80',
    description: 'High-end duplex penthouse in Thane West featuring Italian Statuario marble flooring, bespoke walnut veneer paneling, fluted glass wine bar, and magnetic architectural track lighting.',
    shortDescription: 'Opulent penthouse interior in Thane West with Italian marble, custom joinery, and private terrace lounge.',
    problem: 'Double-height ceiling required balanced acoustic control and grand architectural lighting without making the living area feel cavernous.',
    designGoal: 'Deliver a timeless luxury home utilizing natural Italian stone, champagne gold PVD details, and multi-layered atmospheric lighting.',
    materialsUsed: ['Italian Statuario Marble', 'American Walnut Veneer', 'Champagne PVD Stainless Steel', 'Saint-Gobain Acoustic Glass'],
    keyFeatures: [
      'Bookmatched Italian marble feature wall with ambient backlight',
      'Custom floating staircase with solid teak treads and glass balustrades',
      'Full walk-in dressing wardrobe with velvet jewelry pull-outs',
      'Integrated home bar with backlit onyx counter'
    ],
    area: '2,650 sq. ft.',
    duration: '75 Days',
    year: '2023',
    completionDate: '2023',
    isFeatured: true,
    showOnHome: true,
    luxuryBadge: true,
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1558882224-cca162730191?w=1200&q=80'
    ]
  },
  {
    id: '3',
    slug: 'contemporary-villa-interiors',
    title: 'Contemporary Villa Residence',
    location: 'Dombivli East',
    city: 'Kalyan-Dombivli',
    category: ProjectCategory.RESIDENTIAL,
    type: 'Residential',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80',
    description: 'Comprehensive independent villa interior design in Dombivli featuring custom pooja sanctuary, modern kitchen, false ceiling lighting, and terrace garden deck.',
    shortDescription: 'Sprawling villa interior with traditional Indian accents harmonized with clean modern lines.',
    materialsUsed: ['BWP Plywood', 'White Makrana Marble', 'WPC Outdoor Decking', 'Teak Veneer'],
    keyFeatures: [
      'Vastu-compliant Mandir room with CNC brass jali screens',
      'L-shaped modular kitchen with island breakfast counter',
      'Weatherproof balcony deck with vertical green wall'
    ],
    area: '2,100 sq. ft.',
    duration: '65 Days',
    year: '2024',
    completionDate: '2024',
    isFeatured: true,
    showOnHome: true,
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80',
      'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=1200&q=80'
    ]
  },
  {
    id: '4',
    slug: 'boutique-office-interior',
    title: 'Boutique Corporate Office',
    location: 'Vashi, Navi Mumbai',
    city: 'Navi Mumbai',
    category: ProjectCategory.COMMERCIAL,
    type: 'Office',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80',
    description: 'High-performance commercial interior fit-out in Vashi, Navi Mumbai. Features acoustic glass meeting pods, ergonomic workstations, concealed network raceways, and welcoming reception lounge.',
    shortDescription: 'Modern corporate office fit-out with acoustic glass cabins and collaborative workspaces.',
    materialsUsed: ['Acoustic Glass Partitions', 'Mineral Fiber Ceiling Tiles', 'Commercial Carpet Tiles', 'Fire-Retardant Ply'],
    keyFeatures: [
      'Executive conference room with sound-dampening acoustic felt',
      'Concealed cable raceways across all desking clusters',
      'Energy-efficient 4000K neutral white LED lighting layout'
    ],
    area: '1,850 sq. ft.',
    duration: '38 Days',
    year: '2023',
    completionDate: '2023',
    isFeatured: false,
    showOnHome: true,
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80'
    ]
  },
  {
    slug: 'cozy-studio-apartment',
    id: '5',
    title: 'Space-Optimized Urban Studio',
    location: 'Bandra West, Mumbai',
    city: 'Bandra',
    category: ProjectCategory.RESIDENTIAL,
    type: 'Apartment',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1920&q=80',
    description: 'Clever 1BHK studio transformation in Bandra West maximizing limited square footage with dual-function joinery, sliding partitions, and concealed storage.',
    shortDescription: 'Compact luxury 1BHK in Bandra with smart modular joinery and multi-functional storage.',
    materialsUsed: ['BWP Plywood', 'High Gloss Acrylic', 'Fluted Glass', 'Quartz'],
    keyFeatures: [
      'Foldable dining counter integrated into kitchen cabinet',
      'Pocket sliding door separating bedroom for privacy',
      'Hydraulic bed with huge internal storage volume'
    ],
    area: '540 sq. ft.',
    duration: '40 Days',
    year: '2024',
    completionDate: '2024',
    isFeatured: false,
    showOnHome: true,
    gallery: [
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80'
    ]
  },
  {
    id: '6',
    slug: 'traditional-indian-home',
    title: 'Heritage Elegance 3BHK',
    location: 'Khadakpada, Kalyan',
    city: 'Kalyan-Dombivli',
    category: ProjectCategory.TRADITIONAL,
    type: 'Residential',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1920&q=80',
    description: 'Classic Indian home interior in Khadakpada, Kalyan featuring carved teak woodwork, brass inlays, handcrafted Mandir, and warm ambient lighting.',
    shortDescription: 'Warm Indian interior blending traditional woodcraft with modern comfort.',
    materialsUsed: ['Seasoned Teak Wood', 'Makrana White Marble', 'Brass Inlays', 'BWP Marine Ply'],
    keyFeatures: [
      'Handcrafted solid teak Mandir with traditional bell shutters',
      'Living room wooden ceiling rafters with concealed warm coves',
      'Custom dining credenza with antique brass handles'
    ],
    area: '1,450 sq. ft.',
    duration: '58 Days',
    year: '2023',
    completionDate: '2023',
    isFeatured: false,
    showOnHome: true,
    gallery: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Aashish Bhawnani',
    role: 'Homeowner, Palava City',
    content: 'We recently got two cupboards and one wall TV unit made in our flat by Sonu Enterprises and our experience has been excellent. The team is extremely soft-spoken, polite, and highly professional. Work was completed exactly within the promised schedule. Their pricing was very genuine and reasonable. They also went the extra mile by installing lights inside the cupboards. Highly recommended for reliable interior work.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Vivek Gupta',
    role: 'Homeowner, Flat Renovation',
    content: 'Before starting the interiors of my flat, I met several interior designers, including Sonu, and finally chose him for my flat renovation and interiors. He met my expectations at every stage. His team is excellent and works with complete dedication and commitment. I truly appreciated his honesty and clarity. I would highly recommend him if you are looking for a reliable professional at an affordable price.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Honey Khatri',
    role: 'Homeowner, Full Interior',
    content: 'Amazing work! The design, detailing and finishing were beyond my expectations. Very professional approach and timely completion. Highly recommended for anyone looking for classy interiors.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Madhu Gupta (Renu)',
    role: 'Homeowner',
    content: 'Best services ever... Thanks a lot for making my house look like my dream house.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Madhu Nair',
    role: 'Client, Turnkey Interior',
    content: 'Very honest, sincere, hardworking persons with full dedication and quality. Excellent contractors for multiple solutions.',
    rating: 5,
  }
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
