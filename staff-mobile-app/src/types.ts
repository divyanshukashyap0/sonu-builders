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

export interface Project {
  id: string;
  title: string;
  location: string;
  createdAt?: any;
}
