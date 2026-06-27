export enum ProjectCategory {
  LIVING_ROOM = 'Living Room',
  BEDROOM = 'Bedroom',
  KITCHEN = 'Kitchen',
  BATHROOM = 'Bathroom',
  TV_UNIT = 'TV Unit',
  WARDROBE = 'Wardrobe',
  FALSE_CEILING = 'False Ceiling',
  BALCONY = 'Balcony',
  DINING_ROOM = 'Dining Room',
  POOJA_ROOM = 'Pooja Room',
  HOME_OFFICE = 'Home Office',
  FULL_HOME = 'Full Home Interior',
  COMMERCIAL = 'Commercial Interior',
  OFFICE = 'Office Interior',
  RESIDENTIAL = 'Residential',
  LUXURY = 'Luxury Interiors',
  TRADITIONAL = 'Traditional Style',
  ONGOING = 'Ongoing Projects',
  UPCOMING = 'Upcoming Projects'
}

export type ProjectType = 'Residential' | 'Commercial' | 'Luxury Villa' | 'Apartment' | 'Office' | 'Retail Space' | 'Restaurant';
export type ProjectStatus = 'Ongoing' | 'Completed' | 'Upcoming' | 'Featured';

export interface Project {
  id: string;
  slug?: string;
  title: string;
  location: string;
  address?: string;
  googleMapsUrl?: string;
  city?: string;
  category: ProjectCategory | string;
  type?: ProjectType;
  status?: ProjectStatus;
  
  // Media
  image: string; // Featured/Thumbnail
  heroImage?: string;
  gallery?: string[];
  beforeImages?: string[];
  afterImages?: string[];
  videos?: string[]; // YouTube or MP4 URLs
  instagramReelUrl?: string;
  view360Url?: string;

  // Content
  description: string;
  shortDescription?: string;
  problem?: string;
  designGoal?: string;
  materialSelection?: string;
  finalOutcome?: string;
  keyFeatures?: string[];
  clientRequirements?: string;
  challenges?: string;

  // Interior Details
  style?: string[]; // Multi-select
  colorPalette?: string[];
  materialsUsed?: string[];
  lightingType?: string[];

  // Specs
  area?: string;
  budgetRange?: 'Basic' | 'Premium' | 'Luxury' | string;
  duration?: string;
  year?: string;
  completionDate?: string;

  // SEO
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;

  // Feature Options
  isFeatured?: boolean;
  showOnHome?: boolean;
  isTrending?: boolean;
  luxuryBadge?: boolean;

  // Social
  pinterestLink?: string;
  whatsappShareLink?: string;

  // CTA
  ctaText?: string;
  ctaRedirect?: 'WhatsApp' | 'Contact' | 'Inquiry';

  // Stats (Auto-generated or tracked)
  views?: number;
  inquiryCount?: number;
  createdAt?: any;
  updatedAt?: any;
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
  symbolUrl?: string;
  features?: string[];
  suggestions?: string[];
  gallery?: string[];
  videos?: string[];
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
  tiles?: string;
  color?: string;
  hasTvUnit?: boolean;
  hasModularKitchen?: boolean;
  wardrobeSize?: number; // in sqft
}

export interface ProjectEstimate {
  id: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  city?: string;
  address?: string;
  timeline: string;
  rooms: RoomEstimate[];
  totalBudget: number;
  status: 'New' | 'Quote Sent' | 'Followed Up';
  createdAt: any;
}

export interface MediaUsage {
  id: string;
  type: 'service' | 'project';
  title: string;
}

export interface CloudinaryMedia {
  id: string;
  url: string;
  public_id: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  createdAt: number;
  tags?: string[];
  folder?: string;
  resource_type?: string;
  usageCount?: number;
  usedIn?: MediaUsage[];
}

export type StaffRole = 'Carpenter' | 'Painter' | 'Electrician' | 'POP Worker' | 'Tile Worker' | 'Plumber' | 'Fabricator' | 'Supervisor';

export interface BankDetails {
  bankName: string;
  accountNo: string;
  ifscCode: string;
}

export interface StaffMember {
  id: string;
  employeeId: string; // e.g. SE-EMP-001
  serialNumber?: number;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  aadhaar: string | null;
  address: string | null;
  role: StaffRole | string;
  joiningDate: string;
  salaryType: 'daily' | 'monthly';
  standardWage: number;
  dailyWage?: number; // legacy compatibility
  monthlySalary?: number; // legacy compatibility
  overtimeWage?: number;
  doubleShiftWage?: number;
  status: 'active' | 'inactive';
  emergencyContact: string | null;
  bankDetails: BankDetails;
  siteAssigned: string | null;
  documentsStatus: 'verified' | 'pending';
  createdAt?: any;
  updatedAt?: any;
}

export type AttendanceDayStatus = 'S' | 'P' | 'H' | 'D' | 'A' | '';

export interface AttendanceRecord {
  id: string; // monthId + '_' + staffId
  staffId: string;
  monthId: string; // YYYY-MM
  days: Record<string, AttendanceDayStatus>; // e.g. { "1": "S", "2": "A", ... }
  totalWorkUnits: number;
  totalAbsent: number;
  updatedAt?: any;
}

export interface SalaryRecord {
  id: string; // monthId + '_' + staffId
  staffId: string;
  monthId: string; // YYYY-MM
  fullName: string;
  role: string;
  salaryType: 'daily' | 'monthly';
  standardWage?: number;
  dailyWage: number;
  monthlySalary: number;
  workUnits: number;
  grossSalary: number;
  advance: number;
  netSalary: number;
  status: 'Paid' | 'Unpaid';
  paidAt?: string;
  updatedAt?: any;
}

export interface AdvanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  reason: string;
  date: string; // YYYY-MM-DD
  approvedBy: string;
  createdAt?: any;
}

export interface SiteAllocation {
  id: string;
  siteName: string;
  employeeId: string;
  employeeName: string;
  workType: string;
  startDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  supervisor: string;
  status: 'Ongoing' | 'Completed' | 'Pending';
  createdAt?: any;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  siteName: string;
  amountReceived: number;
  amountPaid: number;
  expenseType: string;
  description: string;
  balance: number; // amountReceived - amountPaid
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}
