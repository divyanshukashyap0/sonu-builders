import {
  Home,
  Building2,
  Sofa,
  Bed,
  ChefHat,
  Bath,
  AlignVerticalSpaceAround,
  Tv,
  Key,
  Trees,
  Hexagon,
  Utensils,
  Laptop,
  Layers,
  Box,
  Wine,
  Grid,
  PaintBucket,
} from 'lucide-react';
import { Service, MumbaiLocation, BlogPost } from '../types';

export const ALL_SERVICES: Service[] = [
  {
    id: 'residential-interior-design',
    slug: 'residential-interior-design',
    title: 'Residential Interior Design',
    seoTitle: 'Residential Interior Designer in Mumbai | Sonu Enterprises',
    metaDescription: 'Expert residential interior design in Mumbai for 1BHK, 2BHK, 3BHK flats, duplexes & penthouses. Turnkey luxury solutions crafted by Sonu Enterprises.',
    h1: 'Residential Interior Design in Mumbai',
    categoryGroup: 'Primary',
    description: 'Complete turnkey home interiors for Mumbai apartments, flats, and luxury residences crafted for modern living.',
    longDescription: 'Sonu Enterprises delivers end-to-end residential interior design services across Mumbai, Kalyan, Thane, and Navi Mumbai. From compact 1BHK/2BHK flat transformations to sprawling sea-facing penthouses, our turnkey solutions integrate bespoke architectural carpentry, smart space-saving layouts, concealed lighting, and durable monsoon-proof materials.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    features: [
      'Comprehensive 3D walkthroughs & detailed architectural drawings',
      'End-to-end society NOC documentation & civil execution',
      'Marine-grade BWP waterproof plywood & anti-termite treatments',
      'Factory-finished modular joinery with German hardware',
      'Dedicated project manager & strict milestone tracking',
      'Post-handover warranty and maintenance support'
    ],
    suggestions: [
      'Opt for open-concept dining-living layouts to maximize ventilation in Mumbai flats.',
      'Use floor-to-ceiling concealed storage to eliminate visual clutter.',
      'Integrate dual-layer moisture barriers on external-facing apartment walls.'
    ],
    layouts: [
      { name: '1BHK & 2BHK Smart Space Planning', description: 'Multi-functional furniture, built-in storage, and wall-hung units to maximize every square foot.' },
      { name: '3BHK & 4BHK Luxury Residences', description: 'Cohesive design language across master suites, kids rooms, modular kitchens, and ambient living foyers.' },
      { name: 'Duplex & Penthouse Turnkey', description: 'Grand ceiling heights, double-height feature walls, imported marble, and bespoke private terraces.' }
    ],
    materials: [
      'IS:710 Marine Grade BWP Plywood (Boiling Water Proof)',
      'Italian Statuario, Bottochino & Indian Composite Marble',
      'Natural Teak & Oak Veneers with PU Polish',
      'High-gloss anti-scratch Acrylic and Soft-touch Matte Laminates'
    ],
    finishes: [
      'Polyurethane (PU) Matte & High Gloss Coatings',
      'Brushed Brass & Champagne Gold Metallic Accents',
      'Micro-cement & Fluted Wall Paneling Textures'
    ],
    hardwareAndLighting: [
      'Hafele, Blum & Hettich Soft-Close Systems',
      'Concealed Magnetic Track Lighting with Dimmable CCT',
      'Profile Cove Lighting with 3000K Warm Architectural LEDs'
    ],
    processSteps: [
      { step: '01', title: 'Consultation & Site Measurement', desc: 'Understanding your family lifestyle, spatial requirements, budget, and society rules.' },
      { step: '02', title: '3D Spatial Modeling & Finishes', desc: 'Photorealistic 3D renders with material samples and lighting layouts.' },
      { step: '03', title: 'Civil & Architectural Execution', desc: 'Carpentry, electrical rewiring, plumbing, POP ceilings, and tile masonry.' },
      { step: '04', title: 'Quality Inspection & Handover', desc: 'Over 80-point quality check, deep cleaning, and seamless handover.' }
    ],
    faqs: [
      { question: 'How long does a complete 2BHK/3BHK interior project take in Mumbai?', answer: 'Typically, a turnkey residential interior in Mumbai takes between 45 to 75 working days, depending on society working hour guidelines (usually 10 AM to 6 PM) and project customization.' },
      { question: 'Do you manage society permissions and contractor NOCs in Mumbai?', answer: 'Yes. We prepare the necessary architectural layout drawings, electrical load specifications, debris removal plans, and contractor indemnity documents required by Mumbai housing societies.' },
      { question: 'How do you handle Mumbai high humidity and monsoon dampness?', answer: 'We exclusively use IS:710 Marine-grade BWP plywood for wet areas, seal all cut edges with waterproof PVC edge-banding, and apply moisture barrier primers on external walls.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80'
    ]
  },
  {
    id: 'commercial-interior-design',
    slug: 'commercial-interior-design',
    title: 'Commercial Interior Design',
    seoTitle: 'Commercial Interior Designer in Mumbai | Office & Retail | Sonu Enterprises',
    metaDescription: 'Modern commercial & office interior designers in Mumbai and Navi Mumbai. Ergonomic corporate offices, boutique retail & clinic interiors by Sonu Enterprises.',
    h1: 'Commercial Interior Design in Mumbai',
    categoryGroup: 'Primary',
    description: 'Productivity-driven office workspaces, boutique commercial studios, and retail interiors across Mumbai MMR.',
    longDescription: 'We design and build inspiring commercial interiors, executive cabins, collaborative co-working layouts, and retail spaces in Mumbai and Navi Mumbai. Our commercial solutions focus on acoustics, ergonomic workflow, fire-safety compliance, modular workstations, and brand-first reception design.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    features: [
      'Ergonomic workstation clusters and executive desk systems',
      'Acoustic conference room wall panelling & sound dampening',
      'HVAC, server room cabling, and fire suppression integration',
      'Reception statement branding with back-lit signage',
      'Durable heavy-duty vitrified and carpet tile flooring'
    ],
    suggestions: [
      'Incorporate biophilic greenery and glass partitions to foster natural daylight.',
      'Use 4000K neutral daylight lighting in work zones to sustain focus.'
    ],
    layouts: [
      { name: 'Open Collaborative Workspaces', description: 'Clean linear benching with integrated wire raceways and acoustic felt dividers.' },
      { name: 'Executive Director Cabins', description: 'Veneer desks, concealed credenzas, sound-insulated glass doors, and lounge seating.' },
      { name: 'Boardrooms & Conference Pods', description: 'AV-ready conference tables, smart projection walls, and high-NRC acoustic treatments.' }
    ],
    materials: [
      'Commercial Grade Fire-Retardant MDF & Particle Boards',
      'Toughened 12mm Acoustic Glass Partitions with Aluminum Profiles',
      'Commercial Grade Stain-Resistant Carpet Tiles and Spun Vinyl'
    ],
    finishes: ['Anti-fingerprint Matte Laminates', 'Textured Acoustic Fabrics', 'Powder-coated Matte Black Aluminum'],
    hardwareAndLighting: ['Heavy duty commercial hardware', 'Anti-glare UGR<19 LED Linear Pendants', 'Occupancy Sensor Smart Lighting'],
    processSteps: [
      { step: '01', title: 'Workplace Strategy & Flow', desc: 'Headcount planning, department adjacency, and server/HVAC requirements.' },
      { step: '02', title: '3D Floor Plans & Compliance', desc: 'Fire exits, evacuation passages, and electrical load balancing.' },
      { step: '03', title: 'Fast-Track Civil & MEP Fitout', desc: 'Coordinated execution to meet commercial lease rent-free periods.' }
    ],
    faqs: [
      { question: 'Can you work during night shifts or weekends in commercial towers?', answer: 'Yes. Commercial projects often require night or weekend execution to adhere to commercial estate management guidelines in BKC, Powai, and Navi Mumbai.' },
      { question: 'Do you provide turnkey MEP (Mechanical, Electrical, Plumbing)?', answer: 'Yes, our turnkey commercial contracts cover electrical wiring, UPS circuits, fire alarm cabling, network data drops, and HVAC ducting coordination.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80'
    ]
  },
  {
    id: 'living-room-interior-design',
    slug: 'living-room-interior-design',
    title: 'Living Room Interior Design',
    seoTitle: 'Living Room Interior Designer in Mumbai | Sonu Enterprises',
    metaDescription: 'Luxurious living room interior design in Mumbai. Custom TV units, designer false ceilings, Italian marble flooring & ambient lighting by Sonu Enterprises.',
    h1: 'Living Room Interior Design in Mumbai',
    categoryGroup: 'Primary',
    description: 'Transforming Mumbai living halls into breathtaking entertainment and relaxation sanctuaries.',
    longDescription: 'The living room is the crown jewel of your home. In Mumbai apartments, creating an expansive, clutter-free living and dining hall requires meticulous balance of proportion, lighting, and materiality. Sonu Enterprises crafts bespoke TV feature walls with backlit onyx or fluted louvers, customized sectional sofas, and seamless false ceiling lighting.',
    icon: Sofa,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    features: [
      'Custom floating TV consoles with hidden cable channels',
      'Designer feature walls in Italian marble, charcoal louvers, or veneer',
      'Ambient multi-zone lighting with cove, spotlights, and chandeliers',
      'Seamless shoe-rack and foyer partition integration',
      'Customized seating layouts tailored for entertaining'
    ],
    suggestions: [
      'Use floor-to-ceiling sheer drapes to enhance perceived ceiling height.',
      'Opt for low-profile furniture to maintain sightlines across compact living halls.'
    ],
    layouts: [
      { name: 'Compact Apartment Living (120 - 180 sq.ft)', description: 'Wall-mounted slim TV unit, sleek L-sofa with concealed storage, and nested coffee tables.' },
      { name: 'Spacious Formal & Family Living (200 - 400 sq.ft)', description: 'Distinct formal foyer, primary sofa cluster, accent armchairs, and dedicated entertainment credenza.' }
    ],
    materials: ['Imported Italian Marble Cladding', 'Fluted WPC & Charcoal Panels', 'BWP Marine Ply with High-Pressure Veneer'],
    finishes: ['Satin PU Wood Polish', 'Champagne Metallic Inlays', 'Matte Anti-Scratch Acrylic'],
    hardwareAndLighting: ['Magnetic Track Lighting', 'Hafele Heavy Duty Concealed Brackets', 'Dimmable Warm White LEDs'],
    processSteps: [
      { step: '01', title: 'Focal Point Planning', desc: 'Determining the ideal orientation for natural light, TV placement, and guest flow.' },
      { step: '02', title: 'Material & Texture Pairing', desc: 'Coordinating stone, fabric upholstery, wood veneer, and rug textures.' },
      { step: '03', title: 'Precision Joinery & Lighting', desc: 'Installing flush cabinetry, concealed LED profile tracks, and ceiling details.' }
    ],
    faqs: [
      { question: 'How do you design a small living room in a Mumbai flat to look bigger?', answer: 'We utilize continuous flooring without visual breaks, floor-to-ceiling sheer curtains, floating entertainment units that expose floor area, and recessed LED cove lighting that raises the perceived ceiling plane.' },
      { question: 'Can you conceal all TV cables, gaming consoles, and set-top boxes?', answer: 'Yes. Every living room TV unit we construct features concealed conduits inside the wall or paneling with access doors for clean, wire-free presentation.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1000&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1000&q=80'
    ]
  },
  {
    id: 'bedroom-interior-design',
    slug: 'bedroom-interior-design',
    title: 'Bedroom Interior Design',
    seoTitle: 'Master Bedroom Interior Designer in Mumbai | Sonu Enterprises',
    metaDescription: 'Serene master bedroom and kids bedroom interior design in Mumbai. Ergonomic wardrobes, custom upholstered beds & tranquil lighting by Sonu Enterprises.',
    h1: 'Bedroom Interior Design in Mumbai',
    categoryGroup: 'Primary',
    description: 'Custom master bedrooms, guest sanctuaries, and playful children rooms engineered for restorative sleep.',
    longDescription: 'In Mumbai high-rises, the bedroom must offer an oasis of calm away from city bustle. Sonu Enterprises creates master suites and kids rooms with custom acoustic bed backs, floor-to-ceiling wardrobes with sensor lighting, integrated study ledges, and warm indirect lighting.',
    icon: Bed,
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80',
    features: [
      'Bespoke upholstered headboards (velvet, boucle, leatherette)',
      'Hydraulic and drawer storage beds with dust-sealed compartments',
      'Integrated floating dressing tables with vanity LED ring mirrors',
      'Dual-side reading lights with separate warm switches',
      'Concealed blackout curtain pelmets for light sealing'
    ],
    suggestions: [
      'Use 2700K warm incandescent lighting to naturally promote melatonin release.',
      'Place wardrobes opposite windows to bounce natural morning light.'
    ],
    layouts: [
      { name: 'Master Bedroom Suite', description: 'King-size upholstered bed, floor-to-ceiling wardrobe with tinted glass, and vanity corner.' },
      { name: 'Children & Teen Bedroom', description: 'Smart bunk or hydraulic bed, study workstation, ergonomic bookshelf, and energetic color palette.' },
      { name: 'Guest Bedroom', description: 'Space-conscious queen bed, luggage storage niches, and dual-purpose study desk.' }
    ],
    materials: ['BWP Plywood Carcass', 'High Density Foam Upholstery', 'Tinted Grey Toughened Glass', 'Matte Laminates'],
    finishes: ['Fabric Textured Wallpaper', 'Natural Veneer with PU Clear Coat', 'Soft-touch Anti-Fingerprint Laminates'],
    hardwareAndLighting: ['Ozone/Hafele Hydraulic Bed Lift Systems', 'Touch Sensor Vanity Mirrors', 'Flexible Gooseneck Bedside Lights'],
    processSteps: [
      { step: '01', title: 'Ergonomic Space Allocation', desc: 'Ensuring minimum 3-foot walking clearance on both sides of the bed.' },
      { step: '02', title: 'Storage & Wardrobe Engineering', desc: 'Customizing hanging vs folded clothes ratio to client lifestyle.' },
      { step: '03', title: 'Acoustics & Lighting Install', desc: 'Layered sound dampening and night ambient controls.' }
    ],
    faqs: [
      { question: 'What is the best bed placement in a Mumbai apartment bedroom?', answer: 'We ensure the bed is not in direct line with the doorway, avoiding direct draft from air conditioners onto the head, and optimizing window alignment for pleasant morning daylight.' },
      { question: 'How do you maximize storage without crowding the bedroom?', answer: 'We use hydraulic bed bases, full-height floor-to-ceiling wardrobes with lofts, and floating nightstands that keep the floor plane visible and easy to clean.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1000&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80'
    ]
  },
  {
    id: 'modular-kitchen-design',
    slug: 'modular-kitchen-design',
    title: 'Modular Kitchen Design',
    seoTitle: 'Modular Kitchen Designer in Mumbai | L-Shape, Parallel, Island | Sonu Enterprises',
    metaDescription: 'Bespoke modular kitchen design in Mumbai. Waterproof BWP marine ply, Hafele/Blum hardware, quartz countertops & L-shaped, parallel & island layouts.',
    h1: 'Modular Kitchen Design in Mumbai',
    categoryGroup: 'Primary',
    description: 'Ergonomic, waterproof modular kitchens built for Indian cooking styles with maximum storage efficiency.',
    longDescription: 'The kitchen is the functional engine of every home. In Mumbai apartments where kitchen footprints vary from compact galley layouts to grand open counters, Sonu Enterprises designs kitchens centered around the golden Work Triangle (Cooktop, Sink, Refrigerator). We use 100% waterproof BWP marine plywood, German soft-close tandem boxes, scratch-resistant quartz, and dedicated tall pantries.',
    icon: ChefHat,
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
    features: [
      'Ergonomic Work Triangle layout planning',
      '100% boiling water proof (BWP 710) plywood carcasses',
      'German soft-close tandem drawer systems (Hafele/Blum/Hettich)',
      'Heavy-duty non-porous Quartz & Granite counter installations',
      'Integrated tall pantry pull-outs, wicker baskets, and corner carousels',
      'Under-cabinet task LED strips and anti-cockroach drain traps'
    ],
    suggestions: [
      'Choose high-gloss acrylic finishes in compact kitchens to amplify natural and task light.',
      'Place heavy spice pull-outs immediately next to the cooktop for swift access during cooking.'
    ],
    layouts: [
      { name: 'L-Shaped Modular Kitchen', description: 'The most popular layout for Mumbai 2BHK/3BHK flats, offering fluid movement and optimal corner utilization.' },
      { name: 'Parallel / Galley Kitchen', description: 'Ideal for long narrow kitchen spaces, separating dry prep from wet cleaning zones.' },
      { name: 'Island Kitchen', description: 'For expansive luxury flats and penthouses, combining cooking with a breakfast bar for entertaining.' },
      { name: 'U-Shaped Kitchen', description: 'Maximum counter run and storage for serious culinary enthusiasts.' }
    ],
    materials: [
      'IS:710 Marine Grade BWP Plywood with calibration',
      'Composite Quartz, KalingaStone & Jet Black Granite Countertops',
      'Toughened Lacquered Glass & Ceramic Tile Backsplashes'
    ],
    finishes: [
      '2mm Anti-Scratch Acrylic Shutter Panels',
      'Seamless PU Paint Shutters with J-Pull Handles',
      'Textured Merino/Century High-Pressure Laminates'
    ],
    hardwareAndLighting: [
      'Blum Antaro / Tandembox Soft-Close Runners',
      'Hafele LeMans Corner Carousels & Tall Larder Units',
      'Under-Cabinet High-CRI 4000K Task LED Channels'
    ],
    processSteps: [
      { step: '01', title: 'Cooking Workflow & Appliance Audit', desc: 'Documenting microwave, OTG, chimney, water purifier, and dishwasher specs.' },
      { step: '02', title: '3D Ergonomic Layout Plan', desc: 'Customizing counter heights (typically 34-36 inches for Indian kitchens) and drawer depths.' },
      { step: '03', title: 'Factory Production & Edge Banding', desc: 'Zero-joint PUR edge banding for lifetime water resistance.' },
      { step: '04', title: 'On-Site Installation & Plumbing', desc: 'Sink cutout, gas line routing, and appliance testing.' }
    ],
    faqs: [
      { question: 'What is the best material for kitchen cabinets in Mumbai?', answer: 'For Mumbai coastal climate, IS:710 Marine BWP Plywood with PVC/Acrylic edge banding is the absolute standard. We strictly avoid MDF or particle board in wet counter areas.' },
      { question: 'What counter depth and height do you recommend?', answer: 'Standard counter depth is 24 to 26 inches, and counter height is 34 inches, tailored to the homeowner height to prevent back strain during prolonged prep work.' },
      { question: 'How do you handle oil fumes and Indian spices?', answer: 'We specify high-suction baffle-filter or filterless chimneys (1200-1500 m3/hr) and non-porous backsplashes that wipe clean with warm water and soap.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1000&q=80',
      'https://images.unsplash.com/photo-1556911223-e250e334621c?w=1000&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ce?w=1000&q=80'
    ]
  },
  {
    id: 'bathroom-interior-design',
    slug: 'bathroom-interior-design',
    title: 'Bathroom Interior Design',
    seoTitle: 'Modern Bathroom Interior Designer in Mumbai | Sonu Enterprises',
    metaDescription: 'Luxury bathroom renovation & interior design in Mumbai. Multi-layer waterproofing, Italian marble cladding, glass shower cubicles & Jaquar/Kohler fittings.',
    h1: 'Bathroom Interior Design in Mumbai',
    categoryGroup: 'Room Interior',
    description: 'Spa-inspired bathroom makeovers engineered with multi-coat waterproofing and premium sanitary fittings.',
    longDescription: 'Bathroom renovations in Mumbai apartments demand technical mastery of waterproofing and plumbing just as much as aesthetic beauty. Sonu Enterprises transforms cramped builder-finish bathrooms into hotel-grade luxury spas with wall-hung vanity units, anti-skid large-format porcelain tiles, frameless glass shower cubicles, and niche shelving.',
    icon: Bath,
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521477?w=1200&q=80',
    features: [
      'Guaranteed 3-layer chemical waterproofing treatment',
      'Frameless 10mm toughened glass shower cubicles',
      'Custom wall-hung vanity cabinets with quartz basin tops',
      'Concealed plumbing with diverters (Grohe, Kohler, Jaquar)',
      'Illuminated anti-fog smart vanity mirrors'
    ],
    suggestions: [
      'Use 4x2 ft large format tiles to minimize grout lines that can trap dirt and moisture.',
      'Always install wall-hung commodes to keep floor washing effortless.'
    ],
    layouts: [
      { name: 'Compact Powder Room', description: 'Pedestal or floating basin, designer accent wallpaper/tile, and warm ambient sconces.' },
      { name: 'Master En-Suite Spa', description: 'Distinct dry and wet zones with glass partition, rain shower head, and double-drawer vanity.' }
    ],
    materials: ['Porcelain Large-Format Anti-Skid Tiles', 'BWP Marine Ply with Acrylic Lining', '10mm Toughened Clear Glass'],
    finishes: ['Matte Black Sanitary Ware', 'Brushed Rose Gold & Chrome Fittings', 'Stone-Effect Porcelain Cladding'],
    hardwareAndLighting: ['Anti-Fog LED Mirrors', 'Waterproof IP65 Recessed Downlights', 'Brass Floor Drains with Anti-Odor Flaps'],
    processSteps: [
      { step: '01', title: 'Tile Stripping & Waterproofing', desc: 'Complete civil hackout, slope leveling, and 72-hour pond testing for leaks.' },
      { step: '02', title: 'Concealed Plumbing & Diverters', desc: 'Pressure-tested CPVC piping and precision concealed fixture installation.' },
      { step: '03', title: 'Tiling & Glass Partitioning', desc: 'Laser-leveled tile setting, epoxy grouting, and shower enclosure sealing.' }
    ],
    faqs: [
      { question: 'Why does bathroom waterproofing often fail in Mumbai flats?', answer: 'Waterproofing fails when contractors apply tiles over single-coat paint without pond testing, or when junction joints between floor and wall are not sealed with fiber mesh. We perform a mandatory 72-hour water ponding test before any tile is laid.' },
      { question: 'Can you renovate a bathroom without disturbing neighboring apartments?', answer: 'Yes. We notify the society management, protect drainage stacks, adhere strictly to permissible drilling hours, and use sound-damped tools.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1620626011761-9963d7521477?w=1000&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1000&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80'
    ]
  },
  {
    id: 'wardrobe-design',
    slug: 'wardrobe-design',
    title: 'Wardrobe Design',
    seoTitle: 'Custom Wardrobe Designer in Mumbai | Sliding & Walk-In Closets | Sonu Enterprises',
    metaDescription: 'Custom wardrobe designers in Mumbai. Sliding door wardrobes, walk-in closets, tinted glass shutters, sensor lighting & internal drawer organizers.',
    h1: 'Custom Wardrobe Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Floor-to-ceiling storage engineering customized for apparel, jewelry, luggage, and Indian attire.',
    longDescription: 'Storage is the biggest challenge for Mumbai apartments. Sonu Enterprises designs custom wardrobes that reach up to the ceiling, utilizing lofts for seasonal luggage while keeping daily apparel effortlessly accessible. We offer sliding wardrobes for space-constrained bedrooms, walk-in closets for master suites, and lacquered glass hinged shutters with built-in LED sensor lighting.',
    icon: AlignVerticalSpaceAround,
    image: 'https://images.unsplash.com/photo-1558882224-cca162730191?w=1200&q=80',
    features: [
      'Floor-to-ceiling floor space utilization with integrated lofts',
      'Smooth sliding door systems with soft-close dampers (Hafele/Hettich)',
      'Tinted glass & aluminum profile shutters with interior lighting',
      'Dedicated compartments for sarees, suits, jewelry, and watches',
      'Concealed full-length vanity mirror options'
    ],
    suggestions: [
      'Use sliding wardrobes where bedside clearance is under 30 inches.',
      'Install motion-activated LED light bars inside deep hanging zones.'
    ],
    layouts: [
      { name: 'Sliding Door Wardrobe', description: 'Zero door-swing footprint; ideal for modern compact Mumbai bedrooms.' },
      { name: 'Hinged Door Wardrobe', description: 'Full view of entire wardrobe contents simultaneously with inside-door accessory racks.' },
      { name: 'Walk-In Closet', description: 'Dedicated luxury dressing room with island jewelry drawers and warm ambient lighting.' }
    ],
    materials: ['IS:710 Marine Grade BWP Plywood', 'Aluminum Slim-Profile Door Frames', 'Toughened Grey/Brown Tinted Glass'],
    finishes: ['Lacquered Glass', 'Anti-Fingerprint Super Matte Laminates', 'Textured Linen & Leatherette Interior Liners'],
    hardwareAndLighting: ['Hafele Top-Hung Sliding Mechanisms', 'Rechargeable/Wired PIR Motion Sensors', 'Jewelry Organizers with Velvet Lining'],
    processSteps: [
      { step: '01', title: 'Wardrobe Audit', desc: 'Counting long garments, folded tees, shoe pairs, and locker requirements.' },
      { step: '02', title: '3D Elevation Design', desc: 'Custom drawer counts, tie racks, and loft heights.' },
      { step: '03', title: 'Factory Assembly & Finish', desc: 'CNC precision cuts and smooth dampening tracks.' }
    ],
    faqs: [
      { question: 'Sliding vs Hinged wardrobes: which is better for a Mumbai flat?', answer: 'If the distance between your bed and wardrobe is less than 3 feet, sliding doors are superior because they don’t occupy walkway space when opened. If space permits, hinged doors provide 100% opening visibility.' },
      { question: 'How do you keep wardrobes moisture-free during Mumbai monsoon?', answer: 'We leave a small breathable air gap between external walls and the wardrobe backing, use BWP plywood, and recommend camphor/silica gel slots in seasonal lofts.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558882224-cca162730191?w=1000&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1000&q=80'
    ]
  },
  {
    id: 'tv-unit-design',
    slug: 'tv-unit-design',
    title: 'TV Unit Design',
    seoTitle: 'Modern TV Unit Designer in Mumbai | Living Room TV Panels | Sonu Enterprises',
    metaDescription: 'Contemporary TV unit design in Mumbai. Floating media consoles, marble backdrops, louvers, concealed wire channels & ambient LED lighting.',
    h1: 'Modern TV Unit Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Sleek, wire-free entertainment consoles and statement feature walls tailored for living rooms and master suites.',
    longDescription: 'A custom TV console anchors the entire living room. Sonu Enterprises designs floating media consoles with fluted louvers, backlit translucent stone, hidden cable conduits, and integrated storage for soundbars and gaming systems.',
    icon: Tv,
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
    features: [
      'Floating wall-mounted consoles for easy floor cleaning',
      'Integrated wire management chasing all cables inside the wall',
      'Acoustic-friendly soundbar and speaker positioning',
      'Stone, veneer, or fluted acrylic backdrop panels',
      'Warm indirect perimeter cove lighting'
    ],
    suggestions: [
      'Keep TV mounting height centered to eye level when seated (approx 42 inches from floor).',
      'Use matte backdrops to prevent screen glare during daytime watching.'
    ],
    layouts: [
      { name: 'Minimalist Floating Ledge', description: 'Clean low-profile drawer ledge with concealed cable entry.' },
      { name: 'Grand Marble & Louver Wall', description: 'Full-wall focal point with Italian marble slab and charcoal fluted vertical paneling.' }
    ],
    materials: ['BWP Plywood Core', 'Veneer with PU Polish', 'Charcoal Louvers', 'Composite Marble'],
    finishes: ['Matte Polyurethane', 'Brushed Metallic Trim', 'High-Gloss Lacquered Glass'],
    hardwareAndLighting: ['Concealed Heavy-Duty Wall Anchors', 'Diffused 3000K LED Strip Channels', 'Push-to-Open Drawers'],
    processSteps: [
      { step: '01', title: 'TV Size & Audio Mapping', desc: 'Screen diagonal, viewing distance, and soundbar wire specs.' },
      { step: '02', title: 'Concealed Conduit Chasing', desc: 'Embedding PVC pipes in the wall so HDMI and power wires remain invisible.' },
      { step: '03', title: 'Paneling & Console Mount', desc: 'Precision leveling and back-lit LED installation.' }
    ],
    faqs: [
      { question: 'Can you mount a 65-inch or 75-inch TV on a hollow panel?', answer: 'Yes. We reinforce the mounting zone directly into the structural brick/concrete wall using heavy-duty Fischer anchors before fixing the aesthetic panel.' },
      { question: 'Will I see any cables hanging below the television?', answer: 'Never. Our core standard includes in-wall PVC conduits connecting the TV to the console drawers below.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1000&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1000&q=80'
    ]
  },
  {
    id: 'false-ceiling-design',
    slug: 'false-ceiling-design',
    title: 'False Ceiling Design',
    seoTitle: 'False Ceiling Designer in Mumbai | POP, Gypsum & Wooden Ceilings | Sonu Enterprises',
    metaDescription: 'Designer false ceiling contractors in Mumbai. Gypsum, POP, wooden rafters, magnetic track lights & energy-efficient LED cove lighting.',
    h1: 'False Ceiling Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Architectural gypsum and POP false ceilings combining concealed air conditioning, magnetic track lights, and ambient coves.',
    longDescription: 'Ceilings are the fifth wall of your room. Sonu Enterprises designs perimeter false ceilings that enhance vertical scale without reducing livable room height. We incorporate seamless Saint-Gobain gypsum boards, magnetic track lighting, acoustic treatments, and ambient cove lighting.',
    icon: Key,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=1200&q=80',
    features: [
      'Genuine Saint-Gobain Gyproc plasterboard installations',
      'Perimeter coves that maintain central ceiling height in Mumbai flats',
      'Concealed magnetic track lighting and adjustable spotlights',
      'AC copper piping and drain concealment',
      'Crack-resistant fiber joint taping and smooth putty finish'
    ],
    suggestions: [
      'In flats with 9-foot ceilings, use sleek 4-inch drop perimeter coves instead of full drops.',
      'Opt for warm white 3000K for living spaces and neutral 4000K for kitchens and study zones.'
    ],
    layouts: [
      { name: 'Perimeter Cove False Ceiling', description: 'Drops only around the room perimeter, bouncing light toward the central ceiling.' },
      { name: 'Minimalist Magnetic Track Ceiling', description: 'Flush recessed tracks with movable spot and flood modules for flexible illumination.' },
      { name: 'Wooden Rafter & Accent Ceilings', description: 'Veneered or PU rafters adding warmth to dining areas and entrance foyers.' }
    ],
    materials: ['Saint-Gobain Gyproc 12.5mm Boards', 'Galvanized Iron (GI) Framing Channels', 'Fiber Joint Tape and Gyproc Jointing Compound'],
    finishes: ['Royal Luxury Emulsion Paint', 'Natural Wood PU Polish for Rafters'],
    hardwareAndLighting: ['Magnetic Track Systems', 'COB Dimmable Spotlights', 'Flicker-Free LED Drivers'],
    processSteps: [
      { step: '01', title: 'Laser Level Grid Layout', desc: 'Establishing precise leveling marks across the ceiling slab.' },
      { step: '02', title: 'GI Channel Framework & Electrical Chasing', desc: 'Rigid framing suspended with anchor fasteners and wire pulling.' },
      { step: '03', title: 'Gypsum Boarding & Seamless Putty', desc: 'Double-taped joints, three coats of putty, and premium paint finish.' }
    ],
    faqs: [
      { question: 'How much height does a false ceiling reduce in a typical Mumbai flat?', answer: 'A well-designed perimeter cove false ceiling only drops 4 to 5 inches around the edges, leaving the central ceiling at full height.' },
      { question: 'Will the false ceiling crack over time?', answer: 'We exclusively use GI framing with proper center-to-center spacing (16 inches) and Saint-Gobain fiberglass tape with flexible jointing compound, preventing settlement cracks.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=1000&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&q=80'
    ]
  },
  {
    id: 'balcony-design',
    slug: 'balcony-design',
    title: 'Balcony Design',
    seoTitle: 'Balcony Interior Designer in Mumbai | Green Deck & Sit-Out | Sonu Enterprises',
    metaDescription: 'Modern balcony design in Mumbai. Weatherproof vertical gardens, composite wooden decking, glass railings & cozy outdoor sit-outs by Sonu Enterprises.',
    h1: 'Balcony Interior Design in Mumbai',
    categoryGroup: 'Room Interior',
    description: 'Transforming Mumbai apartment balconies into lush, weatherproof morning coffee decks and evening retreats.',
    longDescription: 'In Mumbai high-rises, the balcony is your personal slice of open sky. Sonu Enterprises designs outdoor sit-outs with weather-resistant composite wood (WPC) decking, vertical green walls with drip irrigation, compact bistro seating, and ambient fairy/wall lighting.',
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    features: [
      'Weather-resistant Composite Wood (WPC) outdoor decking',
      'Vertical green walls with easy-care natural or UV-stabilized plants',
      'Concealed washing machine and utility storage cabinets',
      'Weatherproof IP66 outdoor ambient lighting',
      'Customized space-efficient coffee counters and bar ledges'
    ],
    suggestions: [
      'Use artificial turf combined with wooden deck tiles to create zoned lounging.',
      'Ensure proper drainage slope so heavy monsoon rains clear quickly without pooling.'
    ],
    layouts: [
      { name: 'Coffee & Relaxation Sit-Out', description: 'WPC flooring, comfortable accent chairs, hanging planters, and warm wall sconces.' },
      { name: 'Smart Utility & Green Balcony', description: 'Neatly disguised laundry station on one side, lush greenery and breakfast counter on the other.' }
    ],
    materials: ['WPC Composite Decking', 'UV-Resistant Artificial Turf', 'Waterproof PVC Utility Shutters'],
    finishes: ['Exterior Grade Weatherproof Coatings', 'Powder-Coated Aluminum Planter Frames'],
    hardwareAndLighting: ['IP66 Waterproof Sconces', 'Stainless Steel 316 Marine Grade Screws'],
    processSteps: [
      { step: '01', title: 'Drainage Slope Inspection', desc: 'Verifying water runoff and rain splash exposure.' },
      { step: '02', title: 'Decking & Wall Cladding', desc: 'Fastening elevated composite deck over sub-frame.' },
      { step: '03', title: 'Greenery & Furniture Setup', desc: 'Positioning planters, seating, and outdoor ambient lights.' }
    ],
    faqs: [
      { question: 'Can balcony wooden decking survive Mumbai heavy monsoons?', answer: 'Yes. We use Wood-Plastic Composite (WPC) decking, which contains zero natural wood pulp that can rot or absorb moisture. It withstands torrential rain and blazing sun without warping.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80'
    ]
  },
  {
    id: 'pooja-room-design',
    slug: 'pooja-room-design',
    title: 'Pooja Room Design',
    seoTitle: 'Pooja Room Interior Designer in Mumbai | Mandir Design | Sonu Enterprises',
    metaDescription: 'Vastu-compliant pooja room and mandir designs in Mumbai flats. Backlit corian, CNC jaali work, brass bells, marble pedestals & sacred serenity.',
    h1: 'Pooja Room Interior Design in Mumbai',
    categoryGroup: 'Room Interior',
    description: 'Serene, Vastu-compliant mandir sanctuaries and compact pooja units with backlit intricate CNC jaalis.',
    longDescription: 'A sacred haven in your home requires spiritual reverence and artistic detailing. In Mumbai apartments, Sonu Enterprises crafts Vastu-aligned pooja rooms and standalone mandir units featuring backlit Corian carvings, CNC-cut jaali screens, brass bell details, and concealed storage for pooja samagri.',
    icon: Hexagon,
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80',
    features: [
      'Vastu Shastra compliant orientation (North-East Ishanya preference)',
      'Intricate CNC cut jaali patterns with warm backlight illumination',
      'Solid Corian / Marble deity pedestals and easy-wipe surfaces',
      'Concealed storage drawers with felt lining for incense and samagri',
      'Pull-out brass or wooden diya extension trays'
    ],
    suggestions: [
      'Incorporate a smoke-resistant exhaust or ceiling baffle above diya areas.',
      'Use 3000K warm diffused backlighting to create a divine, tranquil aura.'
    ],
    layouts: [
      { name: 'Dedicated Mandir Room', description: 'Complete room with marble steps, brass bells, carved wooden doors, and soft cove illumination.' },
      { name: 'Compact Wall-Hung Pooja Unit', description: 'Designed for living or dining alcoves in 1BHK/2BHK flats with folding CNC jaali doors.' }
    ],
    materials: ['DuPont Corian Solid Surface', 'Makrana White Marble', 'Teak Wood & BWP Plywood'],
    finishes: ['Gold Foil Inlays', 'Clear PU Polish on Natural Teak', 'Backlit Acrylic Diffusers'],
    hardwareAndLighting: ['Concealed Soft-Close Runners', 'Heat-Resistant Diya Trays', 'Warm LED Backlit Modules'],
    processSteps: [
      { step: '01', title: 'Vastu & Spatial Alignment', desc: 'Locating optimal corner orientation and prayer direction.' },
      { step: '02', title: 'Sacred Motif & CNC Design', desc: 'Crafting Om, Gayatri, or floral jaali patterns.' },
      { step: '03', title: 'Installation & Brass Accents', desc: 'Fitting marble pedestals, drawers, and warm ambient lighting.' }
    ],
    faqs: [
      { question: 'Can you build a beautiful pooja unit inside a small 2BHK flat?', answer: 'Yes. We specialize in compact wall-mounted or niche mandirs with folding jaali doors that maintain privacy, sanctity, and minimal floor footprint.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1000&q=80'
    ]
  },
  {
    id: 'dining-room-design',
    slug: 'dining-room-design',
    title: 'Dining Room Design',
    seoTitle: 'Dining Room Interior Designer in Mumbai | Sonu Enterprises',
    metaDescription: 'Modern dining room interior design in Mumbai. Marble dining tables, statement pendant lights, bespoke crockery units & comfortable chairs.',
    h1: 'Dining Room Interior Design in Mumbai',
    categoryGroup: 'Room Interior',
    description: 'Inviting dining spaces that bring families together, featuring custom marble tables and statement lighting.',
    longDescription: 'Sonu Enterprises designs elegant dining areas tailored for both daily family meals and entertaining guests. We coordinate dining tables in Italian marble or solid wood, ergonomic upholstered chairs, statement chandeliers, and integrated crockery displays.',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80',
    features: [
      'Custom marble and solid wood dining table fabrications',
      'Comfortable, stain-resistant upholstered dining chairs and bench seating',
      'Statement pendant lighting centered perfectly over table surface',
      'Seamless transition into adjacent modular kitchen or living room'
    ],
    suggestions: [
      'Use bench seating against a wall in compact dining alcoves to fit more guests without blocking walkways.',
      'Ensure a minimum 36-inch clearance around chairs for comfortable movement.'
    ],
    layouts: [
      { name: 'Open Living-Dining Combo', description: 'Cohesive spatial harmony with living room while subtly demarcated by a statement chandelier and rug.' },
      { name: 'Dedicated Formal Dining Room', description: 'Grand 6-seater to 8-seater dining setting with full-height crockery display and wall paneling.' }
    ],
    materials: ['Italian Onyx / Composite Marble', 'Solid Seasoned Ash & Teak Wood', 'Stain-Resistant Performance Fabric'],
    finishes: ['PU Clear Matte Coat', 'Brushed Gold Metal Table Bases'],
    hardwareAndLighting: ['Modern Nordic / Brass Dining Pendants', 'Dimmable Lighting Controls'],
    processSteps: [
      { step: '01', title: 'Table Proportions & Clearance', desc: 'Determining 4, 6, or 8-seater based on dining room dimensions.' },
      { step: '02', title: 'Material Selection', desc: 'Handpicking stone slabs and performance fabrics.' },
      { step: '03', title: 'Installation & Lighting Alignment', desc: 'Suspending chandelier at 30-36 inches above table level.' }
    ],
    faqs: [
      { question: 'What dining table shape works best in Mumbai apartments?', answer: 'For rectangular living-dining spaces, a 6-seater rectangular table with rounded corners or bench seating on one side maximizes seating while keeping walkways open.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&q=80'
    ]
  },
  {
    id: 'home-office-design',
    slug: 'home-office-design',
    title: 'Home Office Design',
    seoTitle: 'Home Office Interior Designer in Mumbai | Study Room Design | Sonu Enterprises',
    metaDescription: 'Ergonomic home office and study room interior design in Mumbai. Cable management, sound-insulated cabins, ergonomic desks & bookshelf storage.',
    h1: 'Home Office Interior Design in Mumbai',
    categoryGroup: 'Room Interior',
    description: 'Work-from-home study spaces engineered with video-call backdrops, ergonomic desks, and clutter-free wire management.',
    longDescription: 'With hybrid work becoming the norm in Mumbai, a dedicated workspace is essential. Sonu Enterprises designs ergonomic home offices with custom desks, concealed cable trays, task lighting, acoustic wall paneling, and curated video-call backdrops.',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80',
    features: [
      'Ergonomic floating or standing-height desk configurations',
      'Acoustic felt or wooden louver video-call backdrop walls',
      'Built-in wire conduits for monitors, laptops, and chargers',
      'Bookshelf storage with document filing compartments',
      'Non-glare, eye-comfort task illumination'
    ],
    suggestions: [
      'Position desks perpendicular to windows to prevent screen glare and eye fatigue.',
      'Use soft acoustic paneling to minimize echo on professional video calls.'
    ],
    layouts: [
      { name: 'Bedroom Study Niche', description: 'Space-optimized corner desk with floating bookshelves and concealed wire raceways.' },
      { name: 'Dedicated Executive Study Room', description: 'Full executive desk, library bookshelves, lounge reading chair, and acoustic door seals.' }
    ],
    materials: ['BWP Plywood with High Pressure Laminate', 'Acoustic Polyester Felt', 'Aluminum Cable Grommets'],
    finishes: ['Matte Wood Grain Laminates', 'Anti-Glare Desk Surfaces'],
    hardwareAndLighting: ['Under-Shelf LED Task Strips', 'Heavy-Duty Floating Brackets'],
    processSteps: [
      { step: '01', title: 'Tech & Gadget Assessment', desc: 'Accounting for multiple screens, printers, and electrical points.' },
      { step: '02', title: 'Ergonomic Drafting', desc: 'Setting desk height at 29-30 inches with adequate knee space.' },
      { step: '03', title: 'Assembly & Wiring Integration', desc: 'Seamlessly concealing all power strips and adapter bricks.' }
    ],
    faqs: [
      { question: 'Can you fit a study workspace into a master bedroom without looking cluttered?', answer: 'Yes. We build floating study desks integrated with wardrobe side panels or window ledges that harmonize with the bedroom aesthetic.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&q=80'
    ]
  },
  {
    id: 'staircase-design',
    slug: 'staircase-design',
    title: 'Staircase Design',
    seoTitle: 'Duplex Staircase Designer in Mumbai | Floating & Glass Railing | Sonu Enterprises',
    metaDescription: 'Modern staircase designs for duplexes, penthouses & villas in Mumbai. Floating wooden treads, frameless glass railings & under-stair smart storage.',
    h1: 'Staircase Interior Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Sculptural architectural staircases with floating wooden treads, frameless glass railings, and under-stair storage.',
    longDescription: 'In Mumbai duplex apartments, penthouses, and row houses in Thane and Navi Mumbai, the staircase is a dominant architectural statement. Sonu Enterprises designs cantilevers, floating wooden steps, illuminated LED risers, frameless glass railings, and functional under-stair storage closets or wine displays.',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    features: [
      'Floating cantilever wooden treads anchored to structural walls',
      '12mm toughened frameless glass balustrades with stainless steel fittings',
      'Step-sensor motion-activated LED riser illumination',
      'Smart under-stair utilization (shoe closets, bookshelves, powder rooms)'
    ],
    suggestions: [
      'Use recessed step lights to safely navigate stairs at night without turning on main lights.'
    ],
    layouts: [
      { name: 'Floating Cantilever Stairs', description: 'Modern, airy design allowing light to pass between open treads.' },
      { name: 'Under-Stair Storage Integrated', description: 'Closed pull-out storage maximizing otherwise wasted volume.' }
    ],
    materials: ['Seasoned Solid Teak / Oak Wood', '12mm Toughened Laminated Glass', 'Structural Steel Core'],
    finishes: ['Anti-Slip Matte Wood Polish', 'Brushed Stainless Steel 304'],
    hardwareAndLighting: ['Stair Tread Profile Lights', 'Heavy-Duty Glass Spigots'],
    processSteps: [
      { step: '01', title: 'Structural Load Calculation', desc: 'Verifying anchor points in concrete columns or load-bearing beams.' },
      { step: '02', title: 'Fabrication & Tread Fitting', desc: 'Precision laser fabrication of steel stringers and wood treads.' },
      { step: '03', title: 'Glass & Lighting Installation', desc: 'Secure balustrade fixing and safety testing.' }
    ],
    faqs: [
      { question: 'Are floating glass staircases safe for children and elders?', answer: 'Yes. We use 12mm-15mm toughened laminated safety glass that will not shatter, and we maintain standard tread depth (10-11 inches) and riser height (6-7 inches) with anti-slip coatings.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80'
    ]
  },
  {
    id: 'crockery-unit-design',
    slug: 'crockery-unit-design',
    title: 'Crockery Unit Design',
    seoTitle: 'Modern Crockery Unit Designer in Mumbai | Glass Display Cabinets | Sonu Enterprises',
    metaDescription: 'Contemporary crockery unit designs for Mumbai homes. Fluted glass cabinets, interior LED backlighting, bar counters & cutlery organizers.',
    h1: 'Crockery Unit Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Display and storage cabinets for fine china, glassware, and dinnerware with fluted glass and ambient interior lighting.',
    longDescription: 'Sonu Enterprises designs elegant crockery units that double as dining room showpieces. Featuring fluted or bronze-tinted glass shutters, aluminum frames, warm spotlights, and velvet-lined cutlery drawers, our units keep your precious tableware dust-free and beautifully displayed.',
    icon: Box,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    features: [
      'Tinted bronze or fluted glass doors with aluminum profiles',
      'Velvet-lined pull-out drawers for silverware and cutlery',
      'Warm LED strip backlighting illuminating glass shelves',
      'Lockable compartments for heirloom collectibles'
    ],
    suggestions: [
      'Incorporate a central stone serving ledge for buffet spreads during dinner parties.'
    ],
    layouts: [
      { name: 'Full-Height Built-In Crockery Display', description: 'Wall-to-wall architectural showcase with lower wooden drawers and upper glass vitrine.' },
      { name: 'Floating Dining Credenza', description: 'Suspended wall-mounted unit ideal for compact dining spaces.' }
    ],
    materials: ['BWP Plywood', 'Slim Aluminum Profile Doors', 'Toughened Fluted Glass'],
    finishes: ['Lacquered Glass', 'PU Painted Veneer', 'Champagne Metallic Edge Trim'],
    hardwareAndLighting: ['Soft-Close Glass Hinges', 'Concealed Touch-Sensor Profile LEDs'],
    processSteps: [
      { step: '01', title: 'Tableware Inventory', desc: 'Sizing shelves for tall wine glasses, dinner plates, and serving bowls.' },
      { step: '02', title: 'Cabinet Engineering', desc: 'Balancing glass display with hidden drawer storage.' },
      { step: '03', title: 'Glass & LED Assembly', desc: 'Dust-proof gasket seals and ambient lighting setup.' }
    ],
    faqs: [
      { question: 'How do you prevent dust from entering crockery display shelves?', answer: 'We install premium dust-seal brush gaskets along all aluminum glass frame perimeters, keeping glassware clean for months.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80'
    ]
  },
  {
    id: 'home-bar-design',
    slug: 'home-bar-design',
    title: 'Home Bar Design',
    seoTitle: 'Luxury Home Bar Designer in Mumbai | Mini Bar Counters | Sonu Enterprises',
    metaDescription: 'Luxury home bar design in Mumbai. Bespoke bar counters, backlit onyx, wine chillers, stemware racks & lounge seating by Sonu Enterprises.',
    h1: 'Luxury Home Bar Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Bespoke entertainment bars, wine displays, and compact cocktail counters tailored for modern hosting.',
    longDescription: 'Entertaining in style begins with a beautifully appointed home bar. Sonu Enterprises crafts luxury bar units with backlit onyx stone, custom wine bottle cubbies, hanging brass stemware racks, integrated mini-refrigerators, and plush bar stools.',
    icon: Wine,
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80',
    features: [
      'Backlit natural onyx or quartz counter tops',
      'Hanging stemware racks and brass glass holders',
      'Integrated wine cooler and ice bucket compartments',
      'Lockable liquor cabinets with mirrored backsplashes'
    ],
    suggestions: [
      'Use warm 2700K illumination behind mirrored or stone panels to set an intimate lounge vibe.'
    ],
    layouts: [
      { name: 'Corner Lounge Bar Counter', description: 'High-top bar counter with footrest, two swivel bar stools, and wall-mounted bottle display.' },
      { name: 'Concealed Folding Bar Cabinet', description: 'Sophisticated credenza that opens up into a complete cocktail mixing station.' }
    ],
    materials: ['Translucent Onyx Stone', 'BWP Marine Ply with Teak Veneer', 'Brushed Brass Metalwork'],
    finishes: ['High-Gloss PU Polish', 'Antique Mirror Backdrops'],
    hardwareAndLighting: ['Dimmable Backlit LED Sheets', 'Soft-Close Heavy-Duty Slides'],
    processSteps: [
      { step: '01', title: 'Appliance & Bottle Sizing', desc: 'Measuring wine cooler, cocktail tools, and bottle heights.' },
      { step: '02', title: 'Stone & Joinery Fabrication', desc: 'Crafting the counter, footrest, and mirrored vitrine.' },
      { step: '03', title: 'Electrical & Backlight Wiring', desc: 'Testing mood lighting controls.' }
    ],
    faqs: [
      { question: 'Can a home bar fit into a standard 2BHK or 3BHK Mumbai apartment?', answer: 'Yes! We frequently design compact bar niches adjacent to dining rooms or concealed fold-out bar cabinets that occupy less than 8 sq.ft when closed.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&q=80'
    ]
  },
  {
    id: 'flooring-design',
    slug: 'flooring-design',
    title: 'Flooring Design',
    seoTitle: 'Flooring Contractor & Designer in Mumbai | Italian Marble, Wooden | Sonu Enterprises',
    metaDescription: 'Premium flooring solutions in Mumbai. Italian marble diamond polishing, vitrified tiles, herringbone wooden flooring & anti-skid bathroom surfaces.',
    h1: 'Flooring Design & Execution in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Precision marble laying, epoxy grouting, engineered wood, and large-format vitrified tile flooring.',
    longDescription: 'Flooring defines the sensory foundation of your interior. Sonu Enterprises provides flawless floor installation and diamond restoration in Mumbai—from seamless mirror-finish Italian marble to warm herringbone wooden flooring and stain-resistant large-format vitrified tiles.',
    icon: Grid,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    features: [
      'Book-matched Italian marble selection and diamond mirror polishing',
      'Laser-leveled large format vitrified tiles (up to 6x4 feet)',
      'Engineered and hardwood floor installations with acoustic underlay',
      'Epoxy grouting for lifetime stain resistance and hygiene'
    ],
    suggestions: [
      'Use continuous flooring from living to passages to make apartments feel significantly more expansive.'
    ],
    layouts: [
      { name: 'Italian Marble Mirror Finish', description: 'Book-matched marble veins with seamless Italian slurry and diamond machine polishing.' },
      { name: 'Herringbone Wooden Flooring', description: 'Warm European oak pattern providing texture to bedrooms and study areas.' }
    ],
    materials: ['Italian Marble (Statuario, Bottochino, Grey William)', 'GVT Large Format Porcelain Tiles', 'Engineered Hardwood'],
    finishes: ['High Gloss Mirror Polish', 'Satin Honed Matte Finish'],
    hardwareAndLighting: ['Brass Transition Profiles', 'Acoustic Sound Dampening Foam Underlay'],
    processSteps: [
      { step: '01', title: 'Sub-floor Screed & Leveling', desc: 'Laser-guided floor screeding to remove any contractor slope discrepancies.' },
      { step: '02', title: 'Stone & Tile Laying', desc: 'Paper-joint laying with specialized polymer adhesive mortars.' },
      { step: '03', title: 'Epoxy Grouting & Diamond Polishing', desc: '8-stage diamond grit polishing and crystalline sealing.' }
    ],
    faqs: [
      { question: 'Italian marble vs Large format vitrified tiles: which is recommended?', answer: 'Italian marble delivers unmatched natural luxury and can be repolished over decades; vitrified tiles provide zero maintenance, high scratch resistance, and faster installation.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1000&q=80'
    ]
  },
  {
    id: 'wallpaper-design',
    slug: 'wallpaper-design',
    title: 'Wallpaper Design',
    seoTitle: 'Designer Wallpaper & Wall Paneling in Mumbai | Sonu Enterprises',
    metaDescription: 'Luxury designer wallpapers and textured wall paneling in Mumbai. Textured fabrics, metallic foil, custom murals & anti-fungal moisture resistant paper.',
    h1: 'Wallpaper & Wall Paneling Design in Mumbai',
    categoryGroup: 'Joinery & Architectural',
    description: 'Curated international wallpapers, customized architectural murals, and fluted acoustic wall paneling.',
    longDescription: 'Walls are the canvas that ties furniture and lighting together. Sonu Enterprises curates and installs imported European wallpapers, textured silk wall coverings, bespoke botanical murals, and wooden fluted panels with anti-fungal, moisture-resistant treatments suitable for Mumbai climate.',
    icon: PaintBucket,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    features: [
      'Imported textured vinyl and non-woven fabric wallpapers',
      'Anti-fungal wall prep preventing monsoon dampness stains',
      'Customized floor-to-ceiling panoramic wall murals',
      'Acoustic fluted wooden and charcoal wall paneling combinations'
    ],
    suggestions: [
      'Use a bold botanical or geometric wallpaper on a single accent wall to anchor living or bed spaces.'
    ],
    layouts: [
      { name: 'Feature Accent Wall', description: 'Statement design behind master bed or living room sofa.' },
      { name: 'Textured Ambient Neutral', description: 'Subtle linen or grasscloth texture applied across all dining or passage walls.' }
    ],
    materials: ['Heavy-Duty Non-Woven Vinyl Wallpaper', 'Natural Grasscloth & Silk Fabric Paper', 'MDF / WPC Charcoal Louver Panels'],
    finishes: ['Embossed Textures', 'Metallic Gold & Bronze Foil Accents', 'Matte Anti-Reflective Coating'],
    hardwareAndLighting: ['Anti-Fungal Adhesive Paste', 'Perimeter LED Wall Washers'],
    processSteps: [
      { step: '01', title: 'Moisture & Smoothness Check', desc: 'Moisture meter reading and applying waterproof primer coat.' },
      { step: '02', title: 'Seamless Pattern Matching', desc: 'Precision laser alignment and seam rolling.' },
      { step: '03', title: 'Protective Top-Coat Seal', desc: 'Edge sealing for longevity in coastal air.' }
    ],
    faqs: [
      { question: 'Will wallpaper peel during the Mumbai rainy season?', answer: 'Standard wallpaper peels if pasted on damp plaster. We apply a waterproofing barrier primer on the wall, use specialized moisture-resistant adhesive, and seal all edges, ensuring years of pristine adhesion.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80'
    ]
  }
];

export const MUMBAI_LOCATIONS: MumbaiLocation[] = [
  {
    slug: 'thane',
    name: 'Thane',
    suburbs: ['Thane West', 'Ghodbunder Road', 'Majiwada', 'Vasant Vihar', 'Hiranandani Estate', 'Kolshet Road'],
    seoTitle: 'Interior Designer in Thane | Luxury Home Interiors | Sonu Enterprises',
    metaDescription: 'Leading interior designer in Thane West, Majiwada & Ghodbunder Rd. Premium flat renovations, modular kitchens & turnkey home interiors by Sonu Enterprises.',
    h1: 'Interior Designer in Thane',
    heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80',
    intro: 'Thane has evolved into one of the most prestigious residential hubs in the Mumbai Metropolitan Region. From expansive high-rises in Hiranandani Estate and Majiwada to modern luxury gated communities along Ghodbunder Road, Sonu Enterprises delivers turnkey interior design and precision execution tailored for Thane homeowners.',
    propertyTypes: [
      { name: 'Luxury High-Rise Apartments (2BHK, 3BHK, 4BHK)', desc: 'Custom spatial planning and high-end finishes for towers by Lodha, Rustomjee, Piramal, and Kalpataru.' },
      { name: 'Penthouses & Duplex Residences', desc: 'Bespoke double-height feature walls, imported Italian marble, private terrace pergolas, and acoustic home theaters.' },
      { name: 'Modern Family Flat Renovations', desc: 'Upgrading older Thane societies with waterproof modular kitchens, smart storage, and ambient false ceilings.' }
    ],
    localChallenges: [
      { challenge: 'Strict Society Regulations & Time Windows', solution: 'Thane gated societies enforce strict 10 AM - 6 PM working windows and acoustic restrictions. Our project managers coordinate off-site factory fabrication to reduce noisy on-site carpentry.' },
      { challenge: 'Elevator & Material Transport Constraints', solution: 'We use pre-measured modular assemblies that fit tower service elevators without risking damage to society common areas.' }
    ],
    process: [
      { step: '01', title: 'On-Site Thane Consultation', desc: 'We inspect your flat, take laser measurements, and discuss your lifestyle vision.' },
      { step: '02', title: '3D Walkthrough & Material Presentation', desc: 'Experience your prospective home in 3D with authentic veneer and fabric samples.' },
      { step: '03', title: 'Turnkey Execution & Quality Handover', desc: 'Direct execution by our master team with regular photo updates and on-time handover.' }
    ],
    faqs: [
      { question: 'Do you work in Hiranandani Estate, Majiwada, and Ghodbunder Road?', answer: 'Yes, we have active project presence and experienced teams working across all prime Thane residential corridors including Majiwada, Vasant Vihar, and Ghodbunder Road.' },
      { question: 'How do you handle society NOCs in Thane high-rises?', answer: 'Our operations team prepares all electrical load calculations, architectural layouts, contractor indemnity bonds, and worker police verifications required by Thane society offices.' }
    ],
    projectIds: ['2']
  },
  {
    slug: 'navi-mumbai',
    name: 'Navi Mumbai',
    suburbs: ['Vashi', 'Nerul', 'Kharghar', 'Seawoods', 'Belapur', 'Airoli'],
    seoTitle: 'Interior Designer in Navi Mumbai | Home & Office | Sonu Enterprises',
    metaDescription: 'Trusted interior designer in Navi Mumbai (Vashi, Nerul, Kharghar, Seawoods). Modern home interiors, luxury modular kitchens & boutique office designs.',
    h1: 'Interior Designer in Navi Mumbai',
    heroImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80',
    intro: 'With its planned infrastructure, wide avenues, and spacious apartments, Navi Mumbai is ideal for contemporary, airy interior design. Sonu Enterprises provides end-to-end residential and commercial interior solutions across Vashi, Nerul, Kharghar, Palm Beach Road, and Seawoods.',
    propertyTypes: [
      { name: 'Spacious Residential Flats (2BHK, 3BHK, 4BHK)', desc: 'Open-concept living rooms, master bedroom walk-in closets, and ergonomic modular kitchens.' },
      { name: 'Seawoods & Palm Beach Luxury Residences', desc: 'High-end turnkey interiors with marble flooring, glass partitions, and smart automation.' },
      { name: 'Corporate & Boutique Offices', desc: 'Acoustic conference rooms, executive cabins, and modern open-plan workstations in Vashi and Belapur.' }
    ],
    localChallenges: [
      { challenge: 'Coastal Salinity & Moisture Exposure', solution: 'Proximity to Thane Creek and coastal air in Vashi and Seawoods requires rust-proof SS304 hardware, BWP marine plywood, and anti-corrosive electrical fittings.' }
    ],
    process: [
      { step: '01', title: 'Consultation & Spatial Audit', desc: 'Understanding your layout and functional needs.' },
      { step: '02', title: 'Customized Design & 3D Renderings', desc: 'Detailed 3D designs tailored to Navi Mumbai apartment proportions.' },
      { step: '03', title: 'Precision Execution', desc: 'Factory-finish carpentry and seamless on-site installation.' }
    ],
    faqs: [
      { question: 'Do you take both residential and office interior projects in Navi Mumbai?', answer: 'Yes. We have executed luxury family homes as well as modern boutique offices in Vashi, Nerul, and Belapur.' }
    ],
    projectIds: ['4']
  },
  {
    slug: 'kalyan-dombivli',
    name: 'Kalyan & Dombivli',
    suburbs: ['Kalyan West', 'Dombivli East', 'Dombivli West', 'Nilje', 'Khadakpada', 'Gandhar Nagar'],
    seoTitle: 'Interior Designer in Kalyan & Dombivli | 15+ Years Trust | Sonu Enterprises',
    metaDescription: 'Top interior designer in Kalyan & Dombivli with 15+ years experience and 4500+ projects. Turnkey home interiors, modular kitchens & bedroom makeovers.',
    h1: 'Interior Designer in Kalyan & Dombivli',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
    intro: 'Kalyan and Dombivli represent the foundational home base of Sonu Enterprises. Having served over 4,500 happy families across Kalyan, Dombivli, and Nilje over 15+ years, we bring unmatched local craftsmanship, honest pricing, and reliable turnkey execution.',
    propertyTypes: [
      { name: 'Complete Home Interior Makeovers', desc: 'Turnkey transformations of 1BHK, 2BHK, and 3BHK flats in Khadakpada, Gandhar Nagar, and Dombivli East.' },
      { name: 'Independent Bungalows & Row Houses', desc: 'Full architectural woodwork, customized staircases, false ceilings, and traditional mandirs.' },
      { name: 'Bespoke Kitchens & Wardrobes', desc: 'Waterproof modular kitchens and space-maximizing wardrobes built with German hardware.' }
    ],
    localChallenges: [
      { challenge: 'Value-First Space Optimization', solution: 'Families in Kalyan and Dombivli demand honest pricing with zero quality shortcuts. We manufacture factory-finished modular units that provide maximum storage per rupee spent.' }
    ],
    process: [
      { step: '01', title: 'Principal Design Consultation', desc: 'Direct planning meeting with our senior architectural and execution team.' },
      { step: '02', title: 'Transparent Itemized Estimate', desc: 'Clear scope of work with zero hidden costs or ambiguous charges.' },
      { step: '03', title: 'Craftsmanship & Handover', desc: 'Dedicated carpenters and master supervisors on site every day.' }
    ],
    faqs: [
      { question: 'Where is your workshop and office located?', answer: 'Our office is at Shop no. 22, Chandresh Godavari, Kalyan - Shilphata Rd, near Nilje station, Dombivali East, Palava City, Kalyan 421204.' },
      { question: 'Can I visit completed projects in Kalyan or Dombivli?', answer: 'Yes! We have hundreds of satisfied clients across Khadakpada, Dombivli East, and Nilje who gladly welcome new homeowners to inspect our finishing quality.' }
    ],
    projectIds: ['1', '3', '6']
  },
  {
    slug: 'palava-city',
    name: 'Palava City',
    suburbs: ['Lakeshore Greens', 'Casa Bella', 'Casa Bella Gold', 'Casa Rio', 'Casa Rio Gold', 'Downtown Palava'],
    seoTitle: 'Interior Designer in Palava City | Lodha Palava Specialist | Sonu Enterprises',
    metaDescription: 'Specialized interior designer for Lodha Palava City flats. Custom modular kitchens, wardrobes & living rooms designed specifically for Palava layouts.',
    h1: 'Interior Designer in Palava City',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80',
    intro: 'Sonu Enterprises is the premier interior design specialist for Lodha Palava City. Located right at Nilje near the Palava entrance, our team has executed hundreds of apartments across Lakeshore Greens, Casa Bella, Casa Rio, and Downtown Palava, mastering the exact room dimensions, duct locations, and society guidelines.',
    propertyTypes: [
      { name: 'Palava 1BHK, 2BHK & 3BHK Flat Layouts', desc: 'Optimized floor plans engineered precisely for Lodha standard room dimensions.' },
      { name: 'Compact Modular Kitchens', desc: 'L-shaped and parallel waterproof kitchens designed around Palava pipeline and gas points.' },
      { name: 'Smart Multi-Functional Bedroom Storage', desc: 'Sliding wardrobes, hydraulic storage beds, and integrated study ledges.' }
    ],
    localChallenges: [
      { challenge: 'Palava Society Delivery Gate Passes & Drilling Hours', solution: 'We maintain ongoing registration with Palava estate management, ensuring swift security entry and zero work delays.' }
    ],
    process: [
      { step: '01', title: 'Same-Day Palava Site Visit', desc: 'Our office is minutes away; we can inspect your flat within hours of your call.' },
      { step: '02', title: 'Pre-Engineered Palava Layout Options', desc: 'Choose from tested, perfected layout modules or create a 100% custom concept.' },
      { step: '03', title: 'Swift Turnkey Handover', desc: 'Streamlined execution in 35 to 50 days.' }
    ],
    faqs: [
      { question: 'Have you worked in my cluster (Lakeshore, Casa Rio, Casa Bella)?', answer: 'Yes, we have executed dozens of flats across every major Palava cluster and know the exact electrical, plumbing, and wall configurations.' }
    ],
    projectIds: ['1']
  },
  {
    slug: 'bandra',
    name: 'Bandra',
    suburbs: ['Bandra West', 'Bandra East', 'Pali Hill', 'Carter Road', 'Bandstand', 'Turner Road'],
    seoTitle: 'Luxury Interior Designer in Bandra, Mumbai | Sonu Enterprises',
    metaDescription: 'Bespoke luxury interior designer in Bandra West & Pali Hill. High-end apartment interiors, contemporary aesthetics & turnkey execution by Sonu Enterprises.',
    h1: 'Luxury Interior Designer in Bandra, Mumbai',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
    intro: 'Bandra stands as Mumbai cultural and architectural epicenter for sophisticated urban living. From sea-facing apartments along Carter Road and Bandstand to serene heritage avenues in Pali Hill, Sonu Enterprises creates bespoke, artistic interior environments combining Italian marble, brass inlays, and understated contemporary minimalism.',
    propertyTypes: [
      { name: 'Sea-Facing Luxury Apartments', desc: 'Floor-to-ceiling sheer glass aesthetics, moisture-resistant marine joinery, and panoramic lounge seating.' },
      { name: 'Pali Hill & Turner Road Penthouses', desc: 'Curated art walls, concealed acoustic home offices, and private terrace bars.' }
    ],
    localChallenges: [
      { challenge: 'Direct Coastal Salt Air & Humidity', solution: 'We use 100% boiling water proof marine ply, electrostatic powder-coated metal fittings, and anti-fungal wall treatments.' }
    ],
    process: [
      { step: '01', title: 'Design Concept & Aesthetic Alignment', desc: 'Crafting a unique mood board matching your personal aesthetic.' },
      { step: '02', title: 'Bespoke Material Curation', desc: 'Handpicking Italian marble lots and designer European hardware.' },
      { step: '03', title: 'White-Glove Execution', desc: 'Surgical craftsmanship with minimum disruption to building residents.' }
    ],
    faqs: [
      { question: 'Do you take complete turnkey projects in Bandra West?', answer: 'Yes, we handle complete turnkey renovations including demolition, civil work, MEP, carpentry, painting, and decor.' }
    ],
    projectIds: ['2']
  },
  {
    slug: 'andheri',
    name: 'Andheri',
    suburbs: ['Andheri West', 'Lokhandwala Complex', 'Oshiwara', 'Andheri East', 'JB Nagar', 'Chakala'],
    seoTitle: 'Interior Designer in Andheri, Mumbai | Sonu Enterprises',
    metaDescription: 'Top interior designer in Andheri West & Lokhandwala. Modern flat interiors, smart storage solutions & turnkey renovations by Sonu Enterprises.',
    h1: 'Interior Designer in Andheri, Mumbai',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
    intro: 'Andheri is one of Mumbai most dynamic residential and commercial powerhouses. From vibrant high-rises in Lokhandwala and Oshiwara to corporate hubs in Andheri East, Sonu Enterprises crafts modern, space-efficient, and luxurious interior spaces designed for energetic Mumbai lifestyles.',
    propertyTypes: [
      { name: '2BHK & 3BHK Flat Renovations in Lokhandwala & Oshiwara', desc: 'Maximizing light, smart built-in wardrobes, and open-plan kitchen designs.' },
      { name: 'Creative Studios & Media Workspaces', desc: 'Acoustic-treated home editing studios, soundproofed cabins, and sleek reception desks.' }
    ],
    localChallenges: [
      { challenge: 'High Density Living & Noise Management', solution: 'We integrate acoustic door seals, double-glazed window casings, and soft-fabric panelling to isolate street noise.' }
    ],
    process: [
      { step: '01', title: 'Space Planning & Lifestyle Audit', desc: 'Tailoring layout to busy working professionals.' },
      { step: '02', title: '3D Virtual Walkthrough', desc: 'Visualizing every room, light angle, and storage drawer.' },
      { step: '03', title: 'Timely Turnkey Delivery', desc: 'Strict milestone management with clean handover.' }
    ],
    faqs: [
      { question: 'How do you handle noise insulation in Andheri flats?', answer: 'We specify acoustic underlay for flooring, sound-damped wall panels, and dense door cores to reduce traffic and city noise.' }
    ],
    projectIds: ['5']
  },
  {
    slug: 'powai',
    name: 'Powai',
    suburbs: ['Hiranandani Gardens', 'Chandivali', 'Powai Vihar', 'Saki Vihar Road', 'IIT Area'],
    seoTitle: 'Interior Designer in Powai, Mumbai | Hiranandani & Luxury Flats | Sonu Enterprises',
    metaDescription: 'Premier interior designer in Powai (Hiranandani Gardens & Chandivali). Neoclassical & contemporary luxury interiors crafted by Sonu Enterprises.',
    h1: 'Interior Designer in Powai, Mumbai',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
    intro: 'Powai, with its scenic lake, tree-lined boulevards, and neoclassical architecture in Hiranandani Gardens, is home to discerning corporate leaders and modern families. Sonu Enterprises designs sophisticated interiors that celebrate generous ceiling heights with warm mouldings, modern track lights, and luxury Italian marble.',
    propertyTypes: [
      { name: 'Hiranandani Neoclassical & Contemporary Flats', desc: 'Crown mouldings, fluted wainscoting, modular kitchen islands, and grand chandeliers.' },
      { name: 'Chandivali Modern High-Rises', desc: 'Clean European minimalism with integrated smart home automation.' }
    ],
    localChallenges: [
      { challenge: 'High Ceilings & Large Window Walls', solution: 'Custom window treatments, double-height drapery tracks, and layered ambient cove lighting that accentuates vertical volume.' }
    ],
    process: [
      { step: '01', title: 'Architectural Analysis', desc: 'Respecting the building structure while introducing modern bespoke luxury.' },
      { step: '02', title: 'Material & Texture Curation', desc: 'Veneers, PU lacquers, and architectural lighting.' },
      { step: '03', title: 'Surgical Installation', desc: 'Dust-controlled execution meeting all society guidelines.' }
    ],
    faqs: [
      { question: 'Can you work with Hiranandani Powai specific architectural guidelines?', answer: 'Yes, our team is well-versed in the structural parameters, facade rules, and interior delivery requirements of Powai residential complexes.' }
    ],
    projectIds: ['2']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-an-interior-designer-in-mumbai',
    title: 'How to Choose an Interior Designer in Mumbai: A Complete Homeowner Guide',
    seoTitle: 'How to Choose an Interior Designer in Mumbai | Expert Guide',
    metaDescription: 'Learn how to select the right interior designer in Mumbai. Compare turnkey vs design-only, check credentials, avoid hidden costs & review real contracts.',
    h1: 'How to Choose an Interior Designer in Mumbai',
    category: 'Homeowner Guide',
    publishedDate: '2026-03-10',
    readTime: '8 min read',
    author: {
      name: 'Sonu Enterprises Editorial Team',
      role: 'Principal Architectural Team, Sonu Enterprises'
    },
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    excerpt: 'Navigating interior designers in Mumbai can be overwhelming. Learn what questions to ask, how to verify real credentials, understand pricing models, and avoid costly renovation traps.',
    tableOfContents: [
      { id: 'turnkey-vs-consultation', title: '1. Turnkey Contractor vs. Design-Only Consultant' },
      { id: 'verifying-real-work', title: '2. How to Verify Genuine Past Projects' },
      { id: 'mumbai-specifics', title: '3. Essential Mumbai Experience (Societies & Climate)' },
      { id: 'pricing-models', title: '4. Understanding Quotes & Avoiding Hidden Costs' },
      { id: 'questions-to-ask', title: '5. Crucial Questions to Ask Before Signing' }
    ],
    sections: [
      {
        id: 'turnkey-vs-consultation',
        heading: '1. Turnkey Contractor vs. Design-Only Consultant: Which Do You Need?',
        content: [
          'In Mumbai, interior services generally fall into two broad models: Design-Only Consultants and Turnkey Design-and-Build Contractors.',
          'Design-only consultants provide 2D drawings and 3D renderings, but leave the execution to external carpenters, plumbers, and electricians you must manage yourself. For busy Mumbai professionals commuting long hours, managing separate sub-contractors quickly leads to delays, finger-pointing when measurements go wrong, and budget blowouts.',
          'A Turnkey Contractor like Sonu Enterprises takes single-point responsibility: from design conception, society approvals, material procurement, on-site civil carpentry, electrical wiring, painting, to final cleaning. You get one accountable partner, fixed milestone schedules, and clear warranty backing.'
        ]
      },
      {
        id: 'verifying-real-work',
        heading: '2. How to Verify Genuine Past Projects',
        content: [
          'The internet is filled with 3D renders that look astonishing on screen but have never been physically built. When vetting an interior company in Mumbai, insist on seeing real, completed site photographs and videos.',
          'Ask if you can speak directly with a past client or visit an ongoing project in your area. Legitimate contractors who take pride in their craft will gladly showcase their carpentry joinery, edge-banding finish, and plumbing rigor.'
        ]
      },
      {
        id: 'mumbai-specifics',
        heading: '3. Essential Mumbai Experience: Societies & Coastal Climate',
        content: [
          'Designing in Mumbai requires local technical knowledge that generic national design aggregators frequently overlook:',
          '• Society Regulations: Societies in Mumbai, Thane, and Navi Mumbai have strict working hours (usually 10 AM to 6 PM, with mandatory 1 PM to 3 PM quiet hours), heavy elevator protection rules, and debris disposal guidelines. An experienced local contractor knows how to prevent society work-stoppages.',
          '• Coastal Humidity & Monsoon Protection: Using commercial-grade MDF or low-quality particle board in Mumbai leads to warped shutters and termite infestation within 2-3 monsoons. Ensure your contractor commits in writing to IS:710 Marine-grade BWP plywood for wet zones.'
        ]
      },
      {
        id: 'pricing-models',
        heading: '4. Understanding Quotes & Avoiding Hidden Costs',
        content: [
          'Beware of quotes that seem suspiciously low per square foot. These almost always exclude essential work such as electrical point relocation, civil debris carting, deep cleaning, or hardware damping accessories.',
          'At Sonu Enterprises, we provide transparent, itemized estimates specifying exact brands (e.g. Century/Merino laminates, Hafele/Hettich hinges, Saint-Gobain gypsum, Jaquar/Kohler fittings). Transparency at the quote stage is the hallmark of a trusted professional.'
        ]
      },
      {
        id: 'questions-to-ask',
        heading: '5. Crucial Questions to Ask Before Signing',
        content: [
          '1. "Who will be on my site daily supervising the artisans?"',
          '2. "What exact plywood grade will be used in my kitchen and bathroom cabinets?"',
          '3. "What happens if the project exceeds the agreed timeline?"',
          '4. "Do you handle all society paperwork and worker police verifications?"'
        ]
      }
    ],
    faqs: [
      { question: 'What is the typical design fee vs turnkey cost in Mumbai?', answer: 'Turnkey interior costs in Mumbai generally range from ₹1,200 to ₹2,500+ per square foot depending on finishes (laminate vs PU vs veneer) and material choices, covering both design and full physical execution.' },
      { question: 'Can I visit a Sonu Enterprises project before deciding?', answer: 'Yes! We encourage prospective clients to visit our ongoing or completed homes in Kalyan, Dombivli, Palava, or Thane to examine our build quality first-hand.' }
    ]
  },
  {
    slug: 'modern-flat-interior-design-ideas-for-mumbai-homes',
    title: 'Modern Flat Interior Design Ideas for Mumbai Homes: Smart Luxury',
    seoTitle: 'Modern Flat Interior Design Ideas for Mumbai Homes | Sonu Enterprises',
    metaDescription: 'Discover modern interior design ideas for Mumbai apartments. Maximize natural light, open-plan living, floating furniture & concealed storage.',
    h1: 'Modern Flat Interior Design Ideas for Mumbai Homes',
    category: 'Design Ideas',
    publishedDate: '2026-03-02',
    readTime: '7 min read',
    author: {
      name: 'Sonu Enterprises Editorial Team',
      role: 'Principal Architectural Team, Sonu Enterprises'
    },
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    excerpt: 'How to make a Mumbai apartment feel expansive, serene, and deeply luxurious through smart space planning, reflective surfaces, and bespoke architectural woodwork.',
    tableOfContents: [
      { id: 'open-flow', title: '1. Create Open Spatial Flow' },
      { id: 'floating-joinery', title: '2. Embrace Floating Joinery & Exposed Floors' },
      { id: 'lighting-layers', title: '3. Layered Ambient Lighting' },
      { id: 'neutral-palettes', title: '4. Curated Color Palettes with Warm Textures' }
    ],
    sections: [
      {
        id: 'open-flow',
        heading: '1. Create Open Spatial Flow',
        content: [
          'The biggest luxury in Mumbai real estate is space. Traditional interior layouts that compartmentalize the living and dining hall with heavy partition walls make rooms feel claustrophobic.',
          'Instead, use visual demarcations: a change in ceiling cove detailing, an open fluted glass screen, or a well-placed dining pendant that defines the eating zone without breaking visual sightlines from the front door to the balcony.'
        ]
      },
      {
        id: 'floating-joinery',
        heading: '2. Embrace Floating Joinery & Exposed Floors',
        content: [
          'When your eye can travel across the entire floor plane without interruption, the room feels significantly larger. Mount your TV consoles, vanities, and nightstands on the wall.',
          'Under-cabinet LED strip lights not only create a soft, cinematic night-light effect but also accentuate the floating feel.'
        ]
      },
      {
        id: 'lighting-layers',
        heading: '3. Layered Ambient Lighting: Banish Harsh Tube Lights',
        content: [
          'Ditch single central overhead tube lights. Modern luxury relies on three distinct layers:',
          '• Ambient Cove Lighting (3000K warm white) reflecting off the ceiling for soft evening relaxation.',
          '• Task Lighting (4000K neutral white) focused on kitchen countertops, vanity mirrors, and study desks.',
          '• Accent Lighting (spotlights and wall washers) highlighting artwork, marble veining, or architectural textures.'
        ]
      },
      {
        id: 'neutral-palettes',
        heading: '4. Curated Color Palettes with Warm Textures',
        content: [
          'Use warm neutrals—ivory, warm taupe, soft beige, and champagne—as the foundational canvas. Add rich tactile dimension through boucle upholstery, fluted wall panels, natural oak veneer, and subtle brushed brass inlays.'
        ]
      }
    ]
  },
  {
    slug: 'modular-kitchen-design-ideas-for-mumbai-apartments',
    title: 'Modular Kitchen Design Ideas for Mumbai Apartments: Layouts & Durability',
    seoTitle: 'Modular Kitchen Design Ideas for Mumbai Apartments | Sonu Enterprises',
    metaDescription: 'Smart modular kitchen design ideas for Mumbai flats. Waterproof BWP marine ply, anti-cockroach fittings, corner carousels & heavy-duty Indian cooking solutions.',
    h1: 'Modular Kitchen Design Ideas for Mumbai Apartments',
    category: 'Kitchen Design',
    publishedDate: '2026-02-22',
    readTime: '9 min read',
    author: {
      name: 'Sonu Enterprises Editorial Team',
      role: 'Principal Architectural Team, Sonu Enterprises'
    },
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',
    excerpt: 'Indian cooking requires intense heat, spices, and frequent washing. Here is how to build a modular kitchen in Mumbai that looks stunning and endures heavy daily use.',
    tableOfContents: [
      { id: 'waterproofing', title: '1. Waterproof Carcass Selection' },
      { id: 'layout-optimization', title: '2. Layouts for Mumbai Flats (L-Shape & Parallel)' },
      { id: 'hardware-storage', title: '3. Smart Hardware & Storage Units' },
      { id: 'ventilation-chimneys', title: '4. High-Suction Ventilation & Spices' }
    ],
    sections: [
      {
        id: 'waterproofing',
        heading: '1. Waterproof Carcass Selection: Why Marine Ply is Non-Negotiable',
        content: [
          'In Mumbai coastal air, sink cabinets encounter daily splashes and humidity. We strictly advocate IS:710 Marine Grade BWP Plywood for all kitchen carcasses.',
          'Ensure the bottom of the sink cabinet is lined with an aluminum or PVC drip tray, protecting woodwork from inadvertent RO or plumbing leaks.'
        ]
      },
      {
        id: 'layout-optimization',
        heading: '2. Layouts for Mumbai Flats: L-Shape vs Parallel',
        content: [
          '• L-Shaped Kitchen: Perfect for open-concept 2BHK/3BHK apartments, freeing up space for an adjacent dining table or breakfast counter.',
          '• Parallel (Galley) Kitchen: The most efficient ergonomic layout for narrow Mumbai builder kitchens, separating cooking (hot zone) on one side from washing and prep (wet zone) on the other.'
        ]
      },
      {
        id: 'hardware-storage',
        heading: '3. Smart Hardware & Storage Units',
        content: [
          '• Tandem Drawers: Full-extension soft-close drawers that hold up to 45 kg of heavy stainless steel cookware.',
          '• Corner Carousels: LeMans swing-out trays that utilize blind corners without awkward bending.',
          '• Tall Pantry Units: Slim pull-out larders providing 6 levels of organized storage for groceries and dry spices.'
        ]
      },
      {
        id: 'ventilation-chimneys',
        heading: '4. High-Suction Ventilation & Easy-Clean Backsplashes',
        content: [
          'For Indian cooking involving tadka and deep frying, specify chimneys with minimum 1200 to 1500 m3/hr suction capacity. Opt for seamless quartz or large porcelain tile backsplashes that wipe clean with warm water and soap.'
        ]
      }
    ]
  },
  {
    slug: 'space-saving-interior-design-ideas-for-mumbai-apartments',
    title: 'Space-Saving Interior Design Ideas for Mumbai 1BHK & 2BHK Apartments',
    seoTitle: 'Space-Saving Interior Design Ideas for Mumbai Flats | Sonu Enterprises',
    metaDescription: 'Genius space-saving interior design ideas for Mumbai 1BHK & 2BHK flats. Multi-functional furniture, floor-to-ceiling storage & mirror reflections.',
    h1: 'Space-Saving Interior Design Ideas for Mumbai Apartments',
    category: 'Space Optimization',
    publishedDate: '2026-02-14',
    readTime: '6 min read',
    author: {
      name: 'Sonu Enterprises Editorial Team',
      role: 'Principal Architectural Team, Sonu Enterprises'
    },
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200&q=80',
    excerpt: 'Living in a compact Mumbai flat does not mean sacrificing elegance. Learn practical, builder-tested ideas to double your storage and open up your floor space.',
    tableOfContents: [
      { id: 'vertical-space', title: '1. Exploit Full Vertical Height' },
      { id: 'dual-purpose', title: '2. Multi-Functional & Convertible Furniture' },
      { id: 'mirror-magic', title: '3. Strategic Mirror Reflections' },
      { id: 'sliding-doors', title: '4. Sliding Doors Over Swings' }
    ],
    sections: [
      {
        id: 'vertical-space',
        heading: '1. Exploit Full Vertical Height with Lofts',
        content: [
          'Most Mumbai flats have ceiling heights between 9 and 10 feet. When wardrobes stop at 7 feet, you lose 20-30% of your potential storage volume while creating a dust-trap on top.',
          'Build floor-to-ceiling wardrobes with integrated upper lofts for winter blankets, extra suitcases, and festive decor.'
        ]
      },
      {
        id: 'dual-purpose',
        heading: '2. Multi-Functional & Convertible Furniture',
        content: [
          '• Hydraulic Bed Bases: Transform the space beneath your mattress into a massive dust-free storage chest.',
          '• Extended Window Ledges: Convert builder bay windows into cozy reading benches with pull-out drawers below.',
          '• Nesting Tables: Coffee tables that tuck beneath each other when floor exercise or kids play space is needed.'
        ]
      },
      {
        id: 'mirror-magic',
        heading: '3. Strategic Mirror Reflections to Double Visual Width',
        content: [
          'Place full-height bronze or grey tinted mirrors in dining nooks or on wardrobe doors opposite windows. They bounce natural daylight deep into interior corridors and visually double the apparent room width.'
        ]
      },
      {
        id: 'sliding-doors',
        heading: '4. Sliding Doors Over Swing Doors',
        content: [
          'Standard hinged doors require a 3-foot clearance arc. In compact bedrooms and bathrooms, replace traditional doors with top-hung sliding pocket doors to reclaim valuable usable floor area.'
        ]
      }
    ]
  },
  {
    slug: '2bhk-interior-design-guide-mumbai',
    title: 'The Ultimate 2BHK Interior Design Guide for Mumbai Homeowners',
    seoTitle: '2BHK Interior Design Guide for Mumbai Flats | Sonu Enterprises',
    metaDescription: 'Complete 2BHK interior design guide for Mumbai homeowners. Room-by-room planning, timelines, material selection, budget considerations & checklist.',
    h1: 'The Ultimate 2BHK Interior Design Guide for Mumbai',
    category: 'Homeowner Guide',
    publishedDate: '2026-02-01',
    readTime: '10 min read',
    author: {
      name: 'Sonu Enterprises Editorial Team',
      role: 'Principal Architectural Team, Sonu Enterprises'
    },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    excerpt: 'Planning your 2BHK interior in Mumbai? From living room layout to kitchen ergonomics and master bedroom sanctuaries, here is the complete step-by-step roadmap.',
    tableOfContents: [
      { id: 'room-by-room', title: '1. Room-by-Room Strategic Priorities' },
      { id: 'civil-modifications', title: '2. Smart Civil Modifications' },
      { id: 'timeline-schedule', title: '3. Realistic Timelines & Handover' },
      { id: 'budget-allocation', title: '4. How to Allocate Your Budget' }
    ],
    sections: [
      {
        id: 'room-by-room',
        heading: '1. Room-by-Room Strategic Priorities',
        content: [
          '• Living Hall: Focus 40% of aesthetic budget here—custom TV wall, false ceiling with cove lighting, and sleek shoe console.',
          '• Modular Kitchen: Prioritize durability—BWP marine ply, quartz countertops, and soft-close tandem drawers.',
          '• Master Bedroom: Emphasize tranquility—upholstered headboard, floor-to-ceiling wardrobe with sensor lighting, and floating vanity.',
          '• Second / Kids Bedroom: Versatility—storage bed, study desk with wire conduits, and modular wardrobe.'
        ]
      },
      {
        id: 'civil-modifications',
        heading: '2. Smart Civil Modifications Before Carpentry',
        content: [
          'Always complete civil plumbing, tile replacement, and electrical rewiring before carpentry begins. Relocate AC power points and drain conduits into the walls so no ugly plastic casings run across your finished paintwork.'
        ]
      },
      {
        id: 'timeline-schedule',
        heading: '3. Realistic Timelines: What to Expect',
        content: [
          'A comprehensive turnkey 2BHK interior in Mumbai takes 45 to 60 working days:',
          '• Days 1-10: Demolition, civil plumbing, and electrical wall chasing.',
          '• Days 11-25: POP false ceiling framing and carcass carpentry fabrication.',
          '• Days 26-40: Shutter laminate pressing, edge banding, and tile laying.',
          '• Days 41-55: Painting putty, primer, finish coats, and lighting fixtures.',
          '• Days 56-60: Deep cleaning, hardware tuning, and white-glove handover.'
        ]
      },
      {
        id: 'budget-allocation',
        heading: '4. How to Allocate Your Budget',
        content: [
          'As a general rule: Kitchen (30%), Living & Dining (30%), Master Bedroom (25%), Second Bedroom & Bathrooms (15%). Invest in hardware that moves every day—hinges, drawer slides, and kitchen faucets.'
        ]
      }
    ]
  },
  {
    slug: 'interior-design-checklist-for-new-mumbai-flat',
    title: 'Interior Design Checklist for a New Mumbai Flat: Handover to Move-In',
    seoTitle: 'Interior Design Checklist for New Mumbai Flat | Sonu Enterprises',
    metaDescription: 'Essential interior design checklist for new Mumbai flat owners. Inspection checks, electrical audit, waterproofing verification & handover roadmap.',
    h1: 'Interior Design Checklist for a New Mumbai Flat',
    category: 'Checklist',
    publishedDate: '2026-01-20',
    readTime: '7 min read',
    author: {
      name: 'Sonu Enterprises Editorial Team',
      role: 'Principal Architectural Team, Sonu Enterprises'
    },
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
    excerpt: 'Getting possession of your new Mumbai flat? Use this comprehensive technical checklist before starting your interior work to prevent costly rework.',
    tableOfContents: [
      { id: 'pre-possession', title: '1. Pre-Interior Technical Inspection' },
      { id: 'society-permissions', title: '2. Society Clearances & NOCs' },
      { id: 'design-decisions', title: '3. Design Decisions to Finalize Early' },
      { id: 'final-handover-audit', title: '4. Final Handover & Snagging Audit' }
    ],
    sections: [
      {
        id: 'pre-possession',
        heading: '1. Pre-Interior Technical Inspection',
        content: [
          '• Check wall moisture levels with a digital moisture meter, especially on external walls and beneath window sills.',
          '• Test water pressure and drainage slopes in all bathrooms and kitchen sink traps.',
          '• Inspect electrical distribution board (MCBs and earth leakage tripping).'
        ]
      },
      {
        id: 'society-permissions',
        heading: '2. Society Clearances & NOCs',
        content: [
          '• Submit architectural layout and electrical drawing copy to society management.',
          '• Pay refundable contractor security deposit and obtain gate passes for workers.',
          '• Understand allowable drilling hours and debris carting schedules.'
        ]
      },
      {
        id: 'design-decisions',
        heading: '3. Design Decisions to Finalize Early',
        content: [
          '• Lock appliance dimensions (refrigerator height, chimney width, microwave cavity) before kitchen carcass cuts.',
          '• Finalize AC copper pipe routing before false ceiling framing.',
          '• Choose primary floor finish to determine door undercut clearances.'
        ]
      },
      {
        id: 'final-handover-audit',
        heading: '4. Final Handover & Snagging Audit',
        content: [
          '• Test all soft-close drawers and cupboard hinges for smooth dampening.',
          '• Inspect all silicon edge seals along kitchen counters and bathroom shower glass.',
          '• Verify all electrical switch sockets and dimmer switches with a circuit tester.'
        ]
      }
    ]
  }
];
