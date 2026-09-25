import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://sonu-builders.in';
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. Core Pillar & Static Pages
const CORE_PAGES = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Sonu Enterprises - Premier Interior Designer & Turnkey Contractor Mumbai',
        caption: 'Over 15 years of master craftsmanship delivering luxury turnkey interiors across Mumbai, Thane, and Kalyan-Dombivli.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
        title: 'Luxury Home Interiors & Bespoke Architecture Mumbai',
        caption: 'End-to-end design, factory modular joinery, and 10-year warranty interior construction.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/interior-designer-mumbai',
    priority: '1.0',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Best Interior Designer in Mumbai - Turnkey Home Renovation',
        caption: 'Complete turnkey interior solutions for 1BHK, 2BHK, 3BHK flats, penthouses, and villas across Mumbai MMR.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/about',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Kalyan-Dombivli, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        title: 'About Sonu Enterprises - 15+ Years of Interior Craftsmanship',
        caption: 'Our journey, in-house factory, master carpenters, and commitment to transparency and quality.',
        geo_location: 'Kalyan-Dombivli, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        title: 'Full Directory of Interior Design Services Mumbai - Sonu Enterprises',
        caption: 'Explore our 18 specialized interior services: Full home interiors, modular kitchens, bedrooms, bathrooms, and home temples.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/contact',
    priority: '0.90',
    changefreq: 'monthly',
    geo_location: 'Palava City, Dombivli, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Contact Sonu Enterprises Interior Designers Mumbai',
        caption: 'Book a free consultation and site measurement at our Kalyan-Dombivli / Palava City office.',
        geo_location: 'Palava City, Dombivli, Maharashtra, India'
      }
    ]
  },
  {
    path: '/ai-tools',
    priority: '0.75',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
        title: 'AI Interior Design & Cost Estimator Tools - Sonu Enterprises',
        caption: 'Instant accurate interior cost calculation for 1BHK, 2BHK, and 3BHK flats in Mumbai.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/blog',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Interior Design Blog & Mumbai Apartment Guides',
        caption: 'Expert advice, cost breakdowns, and decor tips from Mumbai leading interior contractors.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/sitemap',
    priority: '0.50',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: []
  },
  {
    path: '/privacy-policy',
    priority: '0.30',
    changefreq: 'yearly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: []
  },
  {
    path: '/terms',
    priority: '0.30',
    changefreq: 'yearly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: []
  }
];

// 2. Specialized Interior Services & Image Catalog
const SERVICES_DATA = [
  {
    path: '/services/residential-interior-design',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Turnkey Luxury Home Interior Design in Mumbai - Sonu Enterprises',
        caption: 'Complete residential flat interior design with Italian marble flooring, bespoke false ceiling, and luxury carpentry in Mumbai, Thane, and Kalyan.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        title: 'Modern Living Room and Full Apartment Interiors Mumbai',
        caption: 'Spacious living room and dining interior fit-out for 2BHK and 3BHK flats across Mumbai, Thane, and Kalyan-Dombivli.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        title: 'Architectural Full Flat Turnkey Interiors Mumbai',
        caption: 'High-end turnkey flat execution including false ceilings, bespoke joinery, and concealed lighting.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
        title: 'Luxury Home Interior Styling Sonu Enterprises Mumbai',
        caption: 'Contemporary interior design with minimalist furniture, veneer panelling, and luxury chandeliers.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/bedroom-interior-design',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80',
        title: 'Luxury Master Bedroom Interior Design Mumbai',
        caption: 'Master bedroom interior design with custom cushioned headboard, acoustic wall panelling, and integrated warm lighting across Mumbai, Thane, and Kalyan.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=80',
        title: 'Modern Bedroom Suite Design and Bed with Storage Mumbai',
        caption: 'Contemporary bedroom interior featuring hydraulic bed storage, floating bedside tables, and serene ambiance.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600&q=80',
        title: 'Elegant Guest Bedroom and Wardrobe Interior Mumbai',
        caption: 'Minimalist guest bedroom with floor-to-ceiling sliding wardrobe and cove perimeter false ceiling.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?w=1600&q=80',
        title: 'Warm Wooden Master Bedroom Interior Mumbai Flats',
        caption: 'Bespoke bedroom carpentry using IS:710 marine plywood and premium natural veneer finishes.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/modular-kitchen-design',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
        title: 'Modern Modular Kitchen Design in Mumbai',
        caption: 'Premium modular kitchen manufactured with 100% IS:710 Marine Grade BWP Plywood and German Blum soft-close fittings for Mumbai, Thane, and Palava homes.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1600&q=80',
        title: 'Parallel Modular Kitchen with Seamless Quartz Countertop Mumbai',
        caption: 'Ergonomic parallel kitchen layout designed for Mumbai apartments with acrylic shutters and anti-scratch quartz.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80',
        title: 'L-Shaped Modular Kitchen Cabinets and Tandem Drawers Mumbai',
        caption: 'Space-saving L-shaped kitchen with spice pull-outs, cutlery organizers, and tall pantry units.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
        title: 'Luxury Kitchen Island and Breakfast Counter Interior Mumbai',
        caption: 'Open concept kitchen island with profile LED lighting and integrated microwave pantry unit.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/bathroom-interior-design',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80',
        title: 'Luxury Bathroom Interior Design and Renovation Mumbai',
        caption: 'Modern luxury bathroom renovation with large format anti-skid porcelain tiles, Grohe diverters, and floating vanity in Mumbai & Thane.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=80',
        title: 'Spa Bathroom with Frameless Toughened Glass Shower Cubicle Mumbai',
        caption: 'Toughened glass shower enclosure with concealed wall-mounted sanitaryware and ambient back-lit LED mirror.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=80',
        title: 'Modern Bathroom Vanity and Quartz Basin Mumbai',
        caption: 'Waterproof quartz countertop vanity with concealed plumbing and anti-fog mirror cabinet.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/pooja-room-design',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1600&q=80',
        title: 'Sacred Home Mandir and Pooja Room Interior Design Mumbai',
        caption: 'Vastu-compliant sacred home temple with laser-cut CNC jali partition, brass bell inserts, and backlit translucent Corian.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1545048702-7936070012f7?w=1600&q=80',
        title: 'Home Temple Mandir with CNC Brass Jali and Marble Altar Mumbai',
        caption: 'Exquisite Makrana marble mandir with traditional carved columns, Om motif screens, and storage drawers for pooja samagri.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1600&q=80',
        title: 'Compact Alcove Temple Unit for Mumbai Flats - Sonu Enterprises',
        caption: 'Space-efficient wall-hung wooden temple with gold leafing, fire-proof diya surface, and warm golden halo backlighting.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/living-room-interior-design',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        title: 'Modern Living Room Interior Design in Mumbai',
        caption: 'Spacious living room design featuring Italian marble feature wall, acoustic wall panelling, and designer sectional sofa.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1600&q=80',
        title: 'Luxury Living Room Seating and Lighting Mumbai',
        caption: 'Curated living lounge with magnetic architectural track lighting and fluted wooden louvers.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600&q=80',
        title: 'Contemporary Apartment Living Room Interior Mumbai',
        caption: 'Open plan living-dining interior design customized for modern Mumbai urban lifestyle.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/wardrobe-design',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=1600&q=80',
        title: 'Custom Built-In Wardrobes and Walk-in Closets Mumbai',
        caption: 'Floor-to-ceiling modular wardrobe with soft-closing sliding doors, sensor LED strip lights, and velvet jewelry drawers.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1600&q=80',
        title: 'Tinted Glass and Fluted Aluminium Profile Wardrobe Mumbai',
        caption: 'Ultra-modern tinted glass wardrobe with internal organizer modules engineered for Mumbai flat ceiling heights.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/false-ceiling-design',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80',
        title: 'Modern False Ceiling Design and Cove Lighting Mumbai',
        caption: 'Gyproc Saint-Gobain certified gypsum false ceiling with indirect warm 3000K LED cove perimeter lighting.',
        geo_location: 'Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',
        title: 'Architectural False Ceiling with Magnetic Track Spotlights Mumbai',
        caption: 'Zero-crack false ceiling finish with embedded magnetic tracks, recessed COB spotlights, and acoustic wooden rafter drops.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/tv-unit-design',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        title: 'Modern TV Unit Design and Floating Media Console Mumbai',
        caption: 'Backlit Italian marble TV console with fluted louvers, floating wooden drawers, and concealed cable raceways.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/dining-room-design',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80',
        title: 'Luxury Dining Room Interior and Marble Table Mumbai',
        caption: 'Italian marble-top dining table with upholstered designer chairs, statement chandelier, and fluted glass crockery cabinet.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/balcony-design',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
        title: 'Balcony Makeover and Weatherproof Composite Decking Mumbai',
        caption: 'Balcony garden transformation with wooden composite decking, vertical green artificial grass wall, and cozy outdoor seating.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/home-office-design',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1600&q=80',
        title: 'Ergonomic Study Table and Home Office Interior Mumbai',
        caption: 'Work-from-home study desk with overhead bookshelves, cable raceway management, and integrated task lighting.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/commercial-interior-design',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80',
        title: 'Commercial Office Interior Design and Corporate Fit-Outs Mumbai',
        caption: 'Modern commercial office interior in Mumbai with acoustic glass meeting pods, ergonomic workstations, and executive reception.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/staircase-design',
    priority: '0.80',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        title: 'Architectural Duplex Staircase and Glass Railing Design Mumbai',
        caption: 'Cantilevered wooden staircase with toughened glass railing and integrated step risers LED backlighting.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/crockery-unit-design',
    priority: '0.80',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&q=80',
        title: 'Designer Crockery Unit with Warm Vitrine Lighting Mumbai',
        caption: 'Bespoke crockery cabinet with tinted profile glass doors, integrated wine chiller space, and soft-close drawers.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/home-bar-design',
    priority: '0.80',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
        title: 'Modern Home Bar Counter and Lounge Interior Mumbai',
        caption: 'Custom home bar unit with onyx backlit counter, bottle display shelves, and ergonomic bar stools.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/flooring-design',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Italian Marble and Wooden Flooring Installation Mumbai',
        caption: 'Precision Italian marble flooring laying with diamond mirror polish, seamless epoxy grouting, and wooden floor borders.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/services/wallpaper-design',
    priority: '0.80',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
        title: 'Luxury Textured Wallpapers and Fluted Panelling Mumbai',
        caption: 'High-end imported wall coverings, metallic foil accents, and acoustic fluted wall panelling by Sonu Enterprises.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  }
];

// 3. Operational Mumbai Locations - Geo-Targeted for Local Search
const LOCATIONS_DATA = [
  {
    path: '/locations/kalyan-dombivli',
    altPath: '/interior-designers-kalyan-dombivli',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Kalyan-Dombivli, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Interior Designers in Kalyan & Dombivli - Sonu Enterprises',
        caption: 'Headquarters and turnkey interior execution across Khadakpada, Tilak Nagar, Dombivli East, Dombivli West, and Gandhinagar.',
        geo_location: 'Kalyan-Dombivli, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
        title: 'Modular Kitchen Designer in Kalyan & Dombivli',
        caption: 'Bespoke waterproof modular kitchens with German hardware installed in Kalyan and Dombivli residences.',
        geo_location: 'Kalyan-Dombivli, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80',
        title: 'Master Bedroom Interior in Khadakpada Kalyan & Dombivli East',
        caption: 'Luxury master bedroom design with upholstered headboard and storage beds in Kalyan Dombivli.',
        geo_location: 'Kalyan-Dombivli, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1600&q=80',
        title: 'Sacred Home Mandir & Temple Design in Kalyan & Dombivli',
        caption: 'Vastu-compliant pooja rooms with CNC jali screens and backlit onyx stone in Kalyan-Dombivli.',
        geo_location: 'Kalyan-Dombivli, Maharashtra, India'
      }
    ]
  },
  {
    path: '/locations/palava-city',
    altPath: '/interior-designers-palava-city',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Palava City, Dombivli, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80',
        title: 'Interior Designers in Palava City Dombivli - Lodha Apartments Specialist',
        caption: 'Specialized modular kitchens, smart wardrobes, and turnkey interior design for Casa Bella, Casa Rio, and Lakeshore Greens.',
        geo_location: 'Palava City, Dombivli, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1600&q=80',
        title: 'Parallel Modular Kitchens for Lodha Palava City Flats',
        caption: 'Precision engineered kitchen modules matching Palava pipeline and duct alignments with zero space wastage.',
        geo_location: 'Palava City, Dombivli, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1600&q=80',
        title: 'Smart Space-Saving Bedroom Wardrobes in Palava City',
        caption: 'Floor-to-ceiling sliding wardrobes and hydraulic beds designed specifically for Palava apartment dimensions.',
        geo_location: 'Palava City, Dombivli, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1600&q=80',
        title: 'Compact Mandir & Temple Unit for Palava Apartments',
        caption: 'Space-saving alcove pooja room unit with warm backlighting and diya heat-protection in Palava City.',
        geo_location: 'Palava City, Dombivli, Maharashtra, India'
      }
    ]
  },
  {
    path: '/locations/thane',
    altPath: '/interior-designers-thane',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Thane, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80',
        title: 'Luxury Interior Designers in Thane - Hiranandani Estate & Majiwada',
        caption: 'Turnkey interior design and luxury apartments across Ghodbunder Road, Pokhran Road, and Hiranandani Estate Thane.',
        geo_location: 'Thane, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
        title: 'German Modular Kitchens in Thane High-Rises',
        caption: 'Quartz countertops and Blum tandem drawer systems installed across Thane luxury gated societies.',
        geo_location: 'Thane, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=80',
        title: 'Luxury Master Bedroom Interior Design in Thane West',
        caption: 'Custom upholstered headboards and acoustic panelling for high-ceiling flats in Thane.',
        geo_location: 'Thane, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80',
        title: 'Modern Spa Bathroom Renovation in Thane',
        caption: 'Toughened glass shower partitions and anti-skid vitrified tiling for Thane residences.',
        geo_location: 'Thane, Maharashtra, India'
      }
    ]
  },
  {
    path: '/locations/navi-mumbai',
    altPath: '/interior-designers-navi-mumbai',
    priority: '0.95',
    changefreq: 'weekly',
    geo_location: 'Navi Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        title: 'Turnkey Interior Designers in Navi Mumbai - Vashi, Palm Beach, Kharghar',
        caption: 'Modern luxury flats and coastal climate engineered interiors across Vashi, Seawoods, Nerul, and Kharghar high-rises.',
        geo_location: 'Navi Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600&q=80',
        title: 'Waterproof Modular Kitchens in Navi Mumbai (Vashi & Kharghar)',
        caption: 'IS:710 Marine Ply kitchens built to withstand coastal humidity in Navi Mumbai towers.',
        geo_location: 'Navi Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80',
        title: 'Contemporary Bedroom & Wardrobes along Palm Beach Road Navi Mumbai',
        caption: 'Seawoods luxury apartment bedroom styling with tinted glass sliding wardrobes.',
        geo_location: 'Navi Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/locations/bandra',
    altPath: '/interior-designers-bandra',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Bandra, Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Luxury Interior Designers in Bandra West & Pali Hill Mumbai',
        caption: 'High-end bespoke residences and sea-facing penthouse interior transformations in Bandra West.',
        geo_location: 'Bandra, Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=1600&q=80',
        title: 'Walk-In Closets & Luxury Master Suites in Pali Hill Bandra',
        caption: 'Sensor LED illuminated walk-in wardrobes with champagne brass profiles in Bandra.',
        geo_location: 'Bandra, Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/locations/andheri',
    altPath: '/interior-designers-andheri',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Andheri, Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
        title: 'Interior Designers in Andheri West & Lokhandwala Complex Mumbai',
        caption: 'Turnkey flat renovation and modern aesthetic fit-outs in Lokhandwala and Oshiwara Andheri.',
        geo_location: 'Andheri, Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        title: 'Modern TV Console & Living Room Interior in Andheri West',
        caption: 'Acoustic wall panelling and backlit marble entertainment unit in Andheri high-rise flats.',
        geo_location: 'Andheri, Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/locations/powai',
    altPath: '/interior-designers-powai',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Powai, Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        title: 'Interior Designers in Powai & Hiranandani Gardens Mumbai',
        caption: 'Neoclassical and contemporary smart home interiors for lakeside luxury apartments in Powai and Chandivali.',
        geo_location: 'Powai, Mumbai, Maharashtra, India'
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
        title: 'Neoclassical High-Ceiling Interiors in Hiranandani Powai',
        caption: 'Decorative wall mouldings, coffered ceilings, and imported Italian marble flooring in Powai.',
        geo_location: 'Powai, Mumbai, Maharashtra, India'
      }
    ]
  }
];

// 4. Value-Packed Mumbai Blog Guides
const BLOG_DATA = [
  {
    path: '/blog/how-to-choose-interior-designer-mumbai',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
        title: 'How to Choose an Interior Designer in Mumbai Guide',
        caption: 'Step-by-step checklist, realistic fee comparisons, and contractor red flags for Mumbai homeowners.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/blog/modern-flat-interior-design-ideas-mumbai',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        title: 'Modern Flat Interior Design Ideas Mumbai Apartments',
        caption: 'Clever design strategies for visual space expansion, concealed storage, and lighting in Mumbai flats.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/blog/modular-kitchen-design-ideas-mumbai-apartments',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
        title: 'Modular Kitchen Design Ideas for Mumbai Apartments',
        caption: 'Mastering the kitchen work triangle, BWP marine plywood, and space-saving pantry pullouts.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/blog/space-saving-interior-ideas-mumbai-1bhk-2bhk',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
        title: 'Space Saving Interior Ideas for Mumbai 1BHK and 2BHK Homes',
        caption: 'Dual-purpose joinery, hydraulic beds, and sliding partitions to maximize compact city spaces.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/blog/2bhk-interior-design-guide-mumbai-homeowners',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
        title: '2BHK Interior Design Complete Cost and Timeline Guide Mumbai',
        caption: 'Realistic budgeting, society permissions, and step-by-step milestone execution for 2BHK flats.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/blog/interior-design-checklist-new-mumbai-flat',
    priority: '0.85',
    changefreq: 'monthly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
        title: 'Interior Design Checklist for New Mumbai Flat Handover',
        caption: 'Comprehensive inspection checklist for laser measurements, plumbing checks, and electrical layouts.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  }
];

// 5. Gallery Room Category Hubs
const GALLERY_DATA = [
  {
    path: '/gallery',
    priority: '0.90',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
        title: 'Luxury Interior Design Gallery & Inspirations Mumbai',
        caption: 'Browse our curated portfolio of completed modular kitchens, master bedrooms, and turnkey living spaces across Mumbai, Thane, and Kalyan.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/gallery/Kitchens',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
        title: 'Modular Kitchen Photo Gallery Sonu Enterprises Mumbai',
        caption: 'Inspirations for modern acrylic, PU, and quartz modular kitchens in Mumbai, Thane, and Kalyan residences.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/gallery/Bedrooms',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80',
        title: 'Luxury Bedroom Design Photo Gallery Mumbai',
        caption: 'Inspiring master bedroom layouts, upholstered headboards, and bedside lighting concepts across Mumbai high-rises.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/gallery/Living%20&%20Dining',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        title: 'Living and Dining Room Interior Design Gallery Mumbai',
        caption: 'Elegant open-concept living lounges, marble dining tables, and entertainment TV units.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/gallery/Wardrobes',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=1600&q=80',
        title: 'Custom Modular Wardrobes and Closets Gallery Mumbai',
        caption: 'Sliding mirror wardrobes, walk-in closets, and smart organizers built for Mumbai apartments.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  },
  {
    path: '/gallery/Ceilings%20&%20Bathrooms',
    priority: '0.85',
    changefreq: 'weekly',
    geo_location: 'Mumbai, Maharashtra, India',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80',
        title: 'Luxury Ceilings and Bathrooms Photo Gallery Mumbai',
        caption: 'Spa bathroom renovations, glass enclosures, and Gyproc false ceiling cove lighting.',
        geo_location: 'Mumbai, Maharashtra, India'
      }
    ]
  }
];

function generateUrlXml(entry, customPath = null) {
  const locPath = customPath || entry.path;
  const loc = `${DOMAIN}${locPath}`;
  const defaultGeo = entry.geo_location || 'Mumbai, Maharashtra, India';

  let xml = `  <url>\n`;
  xml += `    <loc>${escapeXml(loc)}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>${entry.changefreq || 'weekly'}</changefreq>\n`;
  xml += `    <priority>${entry.priority || '0.8'}</priority>\n`;

  if (entry.images && entry.images.length > 0) {
    for (const img of entry.images) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(img.url)}</image:loc>\n`;
      if (img.title) {
        xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      }
      if (img.caption) {
        xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
      }
      xml += `      <image:geo_location>${escapeXml(img.geo_location || defaultGeo)}</image:geo_location>\n`;
      xml += `    </image:image>\n`;
    }
  }

  xml += `  </url>\n`;
  return xml;
}

// 1. Generate Unified Main sitemap.xml with full Google Image extensions & Local SEO mappings
function buildMainSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n`;

  xml += `  <!-- ========================================== -->\n`;
  xml += `  <!-- CORE PILLAR & MAIN PAGES                  -->\n`;
  xml += `  <!-- ========================================== -->\n`;
  for (const page of CORE_PAGES) {
    xml += generateUrlXml(page);
  }

  xml += `\n  <!-- ========================================== -->\n`;
  xml += `  <!-- 18 SPECIALIZED INTERIOR SERVICES & IMAGES   -->\n`;
  xml += `  <!-- (Interior, Bedroom, Kitchen, Bathroom,     -->\n`;
  xml += `  <!--  Temple, Wardrobes, Ceilings, TV Units)     -->\n`;
  xml += `  <!-- ========================================== -->\n`;
  for (const svc of SERVICES_DATA) {
    xml += generateUrlXml(svc);
  }

  xml += `\n  <!-- ========================================== -->\n`;
  xml += `  <!-- GENUINE MUMBAI OPERATIONAL LOCATIONS      -->\n`;
  xml += `  <!-- Geo-Targeted: Kalyan-Dombivli, Palava,     -->\n`;
  xml += `  <!-- Thane, Navi Mumbai, Bandra, Andheri, Powai  -->\n`;
  xml += `  <!-- ========================================== -->\n`;
  for (const loc of LOCATIONS_DATA) {
    xml += generateUrlXml(loc);
    // Also index friendly location URL format
    if (loc.altPath) {
      xml += generateUrlXml(loc, loc.altPath);
    }
  }

  xml += `\n  <!-- ========================================== -->\n`;
  xml += `  <!-- VALUE-PACKED MUMBAI INTERIOR BLOG GUIDES   -->\n`;
  xml += `  <!-- ========================================== -->\n`;
  for (const blog of BLOG_DATA) {
    xml += generateUrlXml(blog);
  }

  xml += `\n  <!-- ========================================== -->\n`;
  xml += `  <!-- GALLERY & VISUAL INSPIRATION CATEGORIES   -->\n`;
  xml += `  <!-- ========================================== -->\n`;
  for (const gal of GALLERY_DATA) {
    xml += generateUrlXml(gal);
  }

  xml += `</urlset>\n`;
  return xml;
}

// 2. Generate Dedicated Google & Bing Image Sitemap (sitemap-images.xml) with exact local geo tags
function buildImageSitemap() {
  const allEntries = [
    ...CORE_PAGES,
    ...SERVICES_DATA,
    ...LOCATIONS_DATA,
    ...BLOG_DATA,
    ...GALLERY_DATA
  ].filter(e => e.images && e.images.length > 0);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

  for (const entry of allEntries) {
    const defaultGeo = entry.geo_location || 'Mumbai, Maharashtra, India';
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(DOMAIN + entry.path)}</loc>\n`;
    for (const img of entry.images) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(img.url)}</image:loc>\n`;
      if (img.title) {
        xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      }
      if (img.caption) {
        xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
      }
      xml += `      <image:geo_location>${escapeXml(img.geo_location || defaultGeo)}</image:geo_location>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

// Write sitemaps to public/
const publicDir = path.resolve(__dirname, '../public');
const mainXml = buildMainSitemap();
const imgXml = buildImageSitemap();

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainXml, 'utf8');
console.log('✓ Successfully generated public/sitemap.xml with Location & Geo indexing');

fs.writeFileSync(path.join(publicDir, 'sitemap-images.xml'), imgXml, 'utf8');
console.log('✓ Successfully generated public/sitemap-images.xml with Location & Geo indexing');
