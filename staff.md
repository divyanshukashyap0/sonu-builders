# Sonu Enterprises - Staff Portal & Payroll System Guide

Welcome to the User Guide for the **Staff Management, Attendance, Salary, and Expense System** of Sonu Enterprises. 

This system replaces our old Excel sheets with a secure, real-time website. It helps us track staff members, mark attendance, calculate monthly salaries, log advance payments, and monitor site expenses.

---

## Table of Contents
1. [Who Can Do What? (User Roles)](#1-who-can-do-what-user-roles)
2. [Managing the Staff Roster](#2-managing-the-staff-roster)
3. [Marking Attendance & Shift Calculations](#3-marking-attendance--shift-calculations)
4. [Wages, Salary, and Payslips](#4-wages-salary-and-payslips)
5. [Employee Advances Ledger](#5-employee-advances-ledger)
6. [Site Expenses (Suraj Ledger)](#6-site-expenses-suraj-ledger)
7. [Site Allocations (Who Works Where)](#7-site-allocations-who-works-where)
8. [Downloading Monthly Reports](#8-downloading-monthly-reports)
9. [Bulk Data Upload from Excel](#9-bulk-data-upload-from-excel)
10. [Step-by-Step Operator Guide](#10-step-by-step-operator-guide)

---

## 1. Who Can Do What? (User Roles)

To keep our data secure, different people have different levels of access:

*   **Administrators (Admins)**: Can see and edit everything. Only Admins can approve salary payments, edit locked attendance, delete records, or import Excel files.
*   **Site Supervisors / Managers**: Can view the staff roster and mark daily attendance sheets for their assigned locations.
*   **Staff Members (Artisans/Laborers)**: Can log in to see only their own attendance records, advance balances, and download their own salary slips. They cannot see other workers' data.

---

## 2. Managing the Staff Roster

The **Staff Directory** is the digital roster of all our workers. Each profile contains:
*   **Employee ID**: Automatically created (like `SE-EMP-001`).
*   **Serial Number**: Matching the old Excel sequence number.
*   **Personal Info**: Full Name, Phone Number, Alternative Phone, Address, Aadhaar Number, and Emergency Contact.
*   **Google Email**: Used by the worker to securely log in to the system.
*   **Job Role**: Carpenter, Painter, Supervisor, Helper, etc.
*   **Salary Type**: Either `Daily` (paid per shift) or `Monthly` (flat monthly salary).
*   **Wages**: Base daily rate or monthly salary, plus special rates for overtime hours and double shifts.
*   **Bank Details**: Bank Name, Account Number, and IFSC Code (for direct salary transfers).
*   **Documents Status**: Marked as `Verified` or `Pending` depending on whether they submitted their Aadhaar/Bank details.
*   **Status**: `Active` (working) or `Inactive` (no longer working with us).

---

## 3. Marking Attendance & Shift Calculations

Daily shifts are marked using simple letter codes. These codes calculate how much work a person completed:

### Shift Codes:
*   **S** = **Standard Shift** (counts as **1.0** day of work)
*   **P** = **Premium/1.5 Shift** (counts as **1.5** days of work)
*   **H** = **Half Shift** (counts as **0.5** day of work)
*   **D** = **Double Shift** (counts as **2.0** days of work)
*   **A** = **Absent** (counts as **0** work; records an absence)
*   **Empty Cell** = **Off-Duty / Unmarked**

### Attendance Locking Rules:
1.  **12-Hour Daily Lock**: To prevent errors, daily attendance columns automatically lock **12 hours** after the calendar day ends (for example, attendance for Monday locks on Tuesday at 12:00 PM noon). Once locked, supervisors cannot change it—only an Admin can unlock and correct it.
2.  **Monthly Lock**: Admins can lock the entire month's attendance page at the end of the month so that salaries can be processed safely without further changes.

---

## 4. Wages, Salary, and Payslips

Salaries are calculated automatically based on the attendance shift codes and base wage rates:

### How Salaries Are Calculated:
*   **For Daily Workers**: 
    $$\text{Gross Salary} = \text{Total Work Units} \times \text{Base Daily Wage}$$
    *(Example: If a worker completes 20 shifts at ₹1,000/day, their Gross Salary is ₹20,000)*
*   **For Monthly Workers**: 
    $$\text{Gross Salary} = \text{Base Monthly Salary (Flat rate)}$$
*   **Net Payout**: 
    $$\text{Net Salary} = \text{Gross Salary} - \text{Total Advances Deducted}$$
    *(Wages are never calculated below zero)*

### Payslip Downloads:
You can generate and print professional PDF Payslips. These payslips include our company logo, employee details, bank account, shift counts, advance deductions, and net salary.

---

## 5. Employee Advances Ledger

Workers can request financial advances (loans) during the month. 

*   Every time an advance is paid, it is logged under the worker's name.
*   At the end of the month, the system sums up all advances received by the worker during that month.
*   This total advance amount is automatically deducted from their Gross Salary before final payment.

---

## 6. Site Expenses (Suraj Ledger)

This ledger tracks all cash inflows and operational expenses for each construction and interior design site.

*   **Received Amount**: Money received from clients or company treasury.
*   **Paid Amount**: Money paid to vendors, material purchases, site expenses, transport, municipal taxes, etc.
*   **Net Site Balance**: Calculated automatically for each site:
    $$\text{Site Balance} = \text{Amount Received} - \text{Amount Paid}$$
*   The system displays a running summary of the total cash received, paid, and remaining balance at the top of the screen.

---

## 7. Site Allocations (Who Works Where)

This page maps workers to active construction sites.
*   It tells the system where each carpenter or laborer is currently working.
*   The admin dashboard reads this page to show a real-time list of how many artisans are present at each active site.

---

## 8. Downloading Monthly Reports

The system has a **Reports Engine** where you can download official files for auditing or banking:
1.  **Attendance Summary**: Day-by-day sheet showing marked shifts for every worker.
2.  **Salary / Payroll Sheet**: Complete summary of payroll showing Gross Wages, Advances, and Net Payouts for bank transfers.
3.  **Advances Log**: Ledger of all loans issued to workers in the month.
4.  **Site Manpower**: Allocation map of our crew.
5.  **Performance Report**: Worker reliability scores based on attendance.
6.  **Expense Ledger**: Itemized list of all cash flows (Incomes vs Outgoes).
7.  **Site Summaries**: Site-wise totals showing cumulative client receipts, vendor expenditures, and net balances.
8.  **Profit & Loss Statement**: Overall financial summary for the month:
    $$\text{Net Monthly Profit} = \text{Total Received Client Payments} - \text{Total Site Expenses} - \text{Total Staff Payroll}$$

---

## 9. Bulk Data Upload from Excel

If you have data saved in Excel, you can upload it all at once using the **Bulk Importer**. The Excel file must contain four sheets named exactly as follows:

### 1. Sheet Name: `Staff Details` (Roster)
Create columns with these exact headers:
*   `employeeId` (e.g. `SE-EMP-001`)
*   `serialNumber` (Excel row sequence, like `1`, `2`, `3`)
*   `fullName` (Worker Name)
*   `phone` (10-digit number)
*   `alternatePhone` (Second contact, optional)
*   `aadhaar` (12-digit Aadhaar)
*   `address` (Residential Address)
*   `role` (Job type, e.g. Carpenter, Painter, Helper)
*   `salaryType` (Write `daily` or `monthly`)
*   `standardWage` (Daily wage rate or monthly salary amount)
*   `joiningDate` (Date they joined)
*   `documentsStatus` (Write `verified` or `pending`)
*   `status` (Write `active` or `inactive`)

### 2. Sheet Name: `Attendance`
*   `employeeId` (matching the ID in Staff Details)
*   `month` (Format: `YYYY-MM`, like `2026-06`)
*   Columns named `1`, `2`, `3` ... up to `31` (representing days of the month). Write `S`, `P`, `H`, `D`, `A`, or leave blank.

### 3. Sheet Name: `Advance`
*   `employeeId` (matching the ID in Staff Details)
*   `amount` (Value in Rupees, e.g. `5000`)
*   `reason` (e.g. Personal emergency)
*   `date` (Date issued: YYYY-MM-DD)
*   `approvedBy` (Admin name)

### 4. Sheet Name: `Expense`
*   `date` (Date of transaction: YYYY-MM-DD)
*   `siteName` (Active project name)
*   `amountReceived` (Rupees received, or `0`)
*   `amountPaid` (Rupees spent, or `0`)
*   `expenseType` (e.g. Materials, Fuel, Municipal)
*   `description` (Details of the transaction)
*   `createdBy` (Person who made the entry, e.g. Suraj)

---

## 10. Step-by-Step Operator Guide

### How to Onboard a New Worker:
1.  Open the **Staff Core** $\rightarrow$ **Directory** page.
2.  Click **+ Add Staff Member** (Gold button).
3.  Type in their name, Aadhaar, Role, and Bank Details.
4.  Choose the **Salary Scheme**: Select `Daily` or `Monthly` and enter their base `Standard Wage`.
5.  Type their Google Email address. This is required so they can log in to view their private payslips.
6.  Click **Save Staff Member**.
7.  Go to **Site Allocations** to assign them to their current site.

### How to Fill Out Daily Attendance:
1.  Go to **Staff Core** $\rightarrow$ **Attendance** page.
2.  The grid for the current month will open. (Use top arrows to change months).
3.  Click on any day cell next to a worker's name.
4.  Select their shift code from the pop-up: `S` (Standard), `P` (1.5), `H` (Half), `D` (Double), or `A` (Absent).
5.  *Time-saving tip*: Click **Copy Previous Day** on a day's column header to automatically fill in the same shifts as yesterday.
6.  *Remember*: Cells lock 12 hours after the shift date ends. Fill attendance on time!

### How to Disburse a Salary:
1.  Go to **Staff Core** $\rightarrow$ **Salary Slips** page.
2.  Select the completed month.
3.  Check the Gross Wages, Advance Deductions, and Net Payouts for each employee.
4.  Click **Download Payslip** on any row to print or save the PDF copy for records.
5.  Once you transfer the money to their bank, click the green **Mark as Paid** button to record the transaction date and status.
