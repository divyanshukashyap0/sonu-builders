import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useStaff } from '../../../hooks/useStaff';
import { StaffMember, StaffRole, BankDetails } from '../../../types';
import {
    Users, Plus, Search, Edit2, Trash2, ShieldAlert,
    UserCheck, UserX, Loader2, Save, X, Phone, FileText,
    MapPin, Calendar, CheckCircle, Database, AlertCircle, Hash,
    Users2, IndianRupee, CreditCard, Layers, ClipboardList, Zap, ChevronDown
} from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

const ROLES: StaffRole[] = [
    'Carpenter', 'Painter', 'Electrician', 'POP Worker',
    'Tile Worker', 'Plumber', 'Fabricator', 'Supervisor'
];

export default function StaffDirectory() {
    const { staff, loading, error, addStaff, updateStaff, deleteStaff } = useStaff();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [navHubOpen, setNavHubOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [serialNumber, setSerialNumber] = useState<number | ''>('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [alternatePhone, setAlternatePhone] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState<StaffRole | string>('Carpenter');
    const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
    const [salaryType, setSalaryType] = useState<'daily' | 'monthly'>('daily');
    const [standardWage, setStandardWage] = useState(600);
    const [overtimeWage, setOvertimeWage] = useState(900); // e.g. 1.5x of 600
    const [doubleShiftWage, setDoubleShiftWage] = useState(1200); // e.g. 2x of 600
    const [emergencyContact, setEmergencyContact] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [documentsStatus, setDocumentsStatus] = useState<'verified' | 'pending'>('pending');

    const openAddModal = () => {
        setEditingMember(null);
        setSerialNumber(staff.length + 1);
        setFullName('');
        setEmail('');
        setPhone('');
        setAlternatePhone('');
        setAadhaar('');
        setAddress('');
        setRole('Carpenter');
        setJoiningDate(new Date().toISOString().split('T')[0]);
        setSalaryType('daily');
        setStandardWage(600);
        setOvertimeWage(900);
        setDoubleShiftWage(1200);
        setEmergencyContact('');
        setBankName('');
        setAccountNo('');
        setIfscCode('');
        setDocumentsStatus('pending');
        setIsOpen(true);
    };

    const openEditModal = (member: StaffMember) => {
        setEditingMember(member);
        setSerialNumber(member.serialNumber || 0);
        setFullName(member.fullName);
        setEmail(member.email || '');
        setPhone(member.phone);
        setAlternatePhone(member.alternatePhone || '');
        setAadhaar(member.aadhaar || '');
        setAddress(member.address || '');
        setRole(member.role);
        setJoiningDate(member.joiningDate);
        setSalaryType(member.salaryType);
        setStandardWage(member.standardWage || 0);
        setOvertimeWage(member.overtimeWage || 0);
        setDoubleShiftWage(member.doubleShiftWage || 0);
        setEmergencyContact(member.emergencyContact || '');
        setBankName(member.bankDetails?.bankName || '');
        setAccountNo(member.bankDetails?.accountNo || '');
        setIfscCode(member.bankDetails?.ifscCode || '');
        setDocumentsStatus(member.documentsStatus || 'pending');
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            serialNumber: Number(serialNumber) || 0,
            fullName,
            email,
            phone,
            alternatePhone,
            aadhaar: aadhaar || null,
            address: address || null,
            role,
            joiningDate,
            salaryType,
            standardWage: Number(standardWage),
            dailyWage: salaryType === 'daily' ? Number(standardWage) : 0,
            monthlySalary: salaryType === 'monthly' ? Number(standardWage) : 0,
            overtimeWage: salaryType === 'daily' ? Number(overtimeWage) : 0,
            doubleShiftWage: salaryType === 'daily' ? Number(doubleShiftWage) : 0,
            emergencyContact: emergencyContact || null,
            bankDetails: {
                bankName,
                accountNo,
                ifscCode
            },
            siteAssigned: editingMember ? editingMember.siteAssigned : null,
            documentsStatus,
            status: editingMember ? editingMember.status : 'active' as const
        };

        try {
            if (editingMember) {
                await updateStaff(editingMember.id, payload);
            } else {
                await addStaff(payload);
            }
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            alert("Error saving profile details.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (member: StaffMember) => {
        const nextStatus = member.status === 'active' ? 'inactive' : 'active';
        if (window.confirm(`Mark ${member.fullName} as ${nextStatus}?`)) {
            try {
                await updateStaff(member.id, { status: nextStatus });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`PERMANENTLY DELETE ${name}? This action is irreversible.`)) {
            try {
                await deleteStaff(id);
            } catch (err) {
                console.error(err);
            }
        }
    };



    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm);

        const matchesRole = selectedRole === 'All' || member.role === selectedRole;
        const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-grey tracking-wide">Staff Directory</h1>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Sonu Enterprises Roster</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-white hover:text-stone-950 transition-all active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Add Profile</span>
                    </button>
                </div>
            </div>

            {/* Staff Management Navigation Hub */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-2xl p-3 shadow-glass transition-colors">
                {/* Mobile Collapsed Trigger header */}
                <div className="flex sm:hidden justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <Users2 size={16} className="text-[#B8860B] dark:text-luxury-gold" />
                        <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                            Modules: <span className="text-[#B8860B] dark:text-luxury-gold">Directory</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setNavHubOpen(!navHubOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:text-[#B8860B] dark:hover:text-luxury-gold transition-colors"
                    >
                        <span>{navHubOpen ? 'Collapse' : 'Expand'}</span>
                        <ChevronDown size={12} className={`transition-transform duration-300 ${navHubOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Grid list of buttons */}
                <div className={`mt-3 sm:mt-0 flex-wrap gap-2 ${navHubOpen ? 'flex' : 'hidden sm:flex'}`}>
                    {[
                        { icon: Users2, label: 'Directory', path: '/admin/staff', active: true },
                        { icon: Calendar, label: 'Attendance', path: '/admin/staff/attendance' },
                        { icon: IndianRupee, label: 'Salary Slips', path: '/admin/staff/salary' },
                        { icon: CreditCard, label: 'Advances', path: '/admin/staff/advances' },
                        { icon: Layers, label: 'Expenses', path: '/admin/staff/expenses' },
                        { icon: MapPin, label: 'Site Allocations', path: '/admin/staff/site-allocation' },
                        { icon: ClipboardList, label: 'Reports Hub', path: '/admin/staff/reports' },
                        { icon: Zap, label: 'Bulk Import', path: '/admin/staff/import' }
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                                    item.active
                                        ? 'bg-luxury-gold text-stone-950 border-transparent shadow-glow-gold'
                                        : 'bg-stone-50 dark:bg-stone-950/40 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-white/5 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon size={14} className={item.active ? 'text-stone-950' : 'text-[#B8860B] dark:text-luxury-gold'} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Error handling */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
                    <ShieldAlert size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Filters Bar */}
            <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-2xl p-4 shadow-glass transition-colors duration-300">
                {/* Mobile Collapsed Header */}
                <div className="flex sm:hidden justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#B8860B] dark:text-luxury-gold" />
                        <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                            Search & Filters 
                            {(searchTerm || selectedRole !== 'All' || selectedStatus !== 'All') && (
                                <span className="ml-1.5 bg-luxury-gold/20 text-[#B8860B] dark:text-luxury-gold text-[9px] px-1.5 py-0.5 rounded-md font-bold">Active</span>
                            )}
                        </span>
                    </div>
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-955/40 border border-stone-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:text-[#B8860B] dark:hover:text-luxury-gold transition-colors"
                    >
                        <span>{filtersOpen ? 'Hide' : 'Show'}</span>
                        <ChevronDown size={12} className={`transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filter Inputs Grid */}
                <div className={`mt-3 sm:mt-0 flex flex-col md:flex-row gap-4 ${filtersOpen ? 'flex' : 'hidden sm:flex'}`}>
                    {/* Search input */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Scan name, ID or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-650 transition-colors"
                        />
                    </div>

                    {/* Role filter */}
                    <div className="w-full md:w-48">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl px-4 py-3 text-xs outline-none text-stone-900 dark:text-white cursor-pointer transition-colors"
                        >
                            <option value="All" className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">All Roles</option>
                            {ROLES.map(r => (
                                <option key={r} value={r} className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status filter */}
                    <div className="w-full md:w-40">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl px-4 py-3 text-xs outline-none text-stone-900 dark:text-white cursor-pointer transition-colors"
                        >
                            <option value="All" className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">All Statuses</option>
                            <option value="active" className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">Active</option>
                            <option value="inactive" className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-stone-500">Decrypting Roster...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.length > 0 ? (
                        filteredStaff.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => openEditModal(member)}
                                className={`bg-white dark:bg-stone-950/40 border ${member.status === 'active' ? 'border-stone-200 dark:border-white/5' : 'border-red-500/20 dark:border-red-500/10 opacity-75'} rounded-2xl p-6 shadow-glass relative group overflow-hidden transition-all duration-300 hover:border-luxury-gold/30 hover:shadow-glow-gold cursor-pointer`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-luxury-gold/5 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black tracking-widest text-luxury-gold/65 uppercase">{member.employeeId}</span>
                                            {member.serialNumber && (
                                                <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400">Sr. #{member.serialNumber}</span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-serif text-stone-900 dark:text-white mt-0.5">{member.fullName}</h3>
                                        <span className="inline-block bg-luxury-gold/15 text-luxury-gold text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                                            {member.role}
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditModal(member); }}
                                            className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-500 hover:text-luxury-gold rounded-lg transition-colors"
                                            title="Edit profile"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleStatus(member); }}
                                            className={`p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors text-stone-500 ${member.status === 'active' ? 'hover:text-red-650 dark:hover:text-red-400' : 'hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                                            title={member.status === 'active' ? 'Deactivate profile' : 'Activate profile'}
                                        >
                                            {member.status === 'active' ? <UserX size={13} /> : <UserCheck size={13} />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(member.id, member.fullName); }}
                                            className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-500 hover:text-red-500 rounded-lg transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-white/5 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} className="text-stone-500 dark:text-stone-400 flex-shrink-0" />
                                        <span>{member.phone} {member.alternatePhone && <span className="text-stone-500 dark:text-stone-550">/ {member.alternatePhone}</span>}</span>
                                    </div>
                                    {member.email && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">Email:</span>
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <FileText size={12} className="text-stone-500 dark:text-stone-400 flex-shrink-0" />
                                        <span>Aadhaar: {member.aadhaar || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-stone-500 dark:text-stone-400 flex-shrink-0" />
                                        <span>Joined: {member.joiningDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={12} className="text-stone-500 dark:text-stone-400 flex-shrink-0" />
                                        <span className="truncate">Site: {member.siteAssigned || 'Not Assigned'}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-stone-200 dark:border-white/5 pt-2 mt-2">
                                        <span className="text-[10px] text-stone-500 dark:text-stone-450 uppercase font-bold">Documents:</span>
                                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${member.documentsStatus === 'verified'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {member.documentsStatus === 'verified' ? 'Verified' : 'Pending Verification'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t border-stone-200 dark:border-white/5 pt-3 mt-3 text-[11px]">
                                        <div>
                                            <span className="text-stone-500 dark:text-stone-450 block text-[8px] uppercase font-bold">Salary Mode</span>
                                            <span className="text-stone-900 dark:text-white capitalize font-semibold">{member.salaryType}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-stone-500 dark:text-stone-450 block text-[8px] uppercase font-bold">Base Wage Matrix</span>
                                            <span className="text-luxury-gold font-bold">
                                                {member.salaryType === 'daily'
                                                    ? `₹${member.standardWage}/day`
                                                    : `₹${member.standardWage}/mo`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {member.salaryType === 'daily' && (member.overtimeWage || member.doubleShiftWage) ? (
                                        <div className="grid grid-cols-2 text-[10px] bg-stone-50 dark:bg-stone-950/50 p-2 rounded-xl border border-stone-200 dark:border-white/5 gap-2 mt-2">
                                            <div>
                                                <span className="text-stone-500 dark:text-stone-400 block text-[8px] font-bold uppercase">Overtime</span>
                                                <span className="text-amber-600 dark:text-amber-300 font-bold">₹{member.overtimeWage || 0}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-stone-500 dark:text-stone-400 block text-[8px] font-bold uppercase">Double Shift</span>
                                                <span className="text-emerald-600 dark:text-emerald-300 font-bold">₹{member.doubleShiftWage || 0}</span>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white dark:bg-stone-950/20 border border-stone-200 dark:border-white/5 rounded-2xl py-16 text-center text-stone-500">
                            No employees match criteria. Add new profile.
                        </div>
                    )}
                </div>
            )}

            {/* Add / Edit Profile Modal */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-luxury-gold/20 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 transition-colors duration-300" data-lenis-prevent>
                        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-white/5 bg-gradient-to-r from-luxury-gold/5 to-transparent">
                            <div>
                                <h3 className="text-xl font-serif text-stone-900 dark:text-white">
                                    {editingMember ? "Edit Staff Profile" : "Create New Staff Profile"}
                                </h3>
                                <p className="text-[9px] uppercase tracking-widest text-luxury-gold opacity-75 mt-1">Enterprise Registry</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full transition-colors text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto premium-scroll">
                            <h4 className="text-xs uppercase font-black text-luxury-gold tracking-widest border-b border-stone-200 dark:border-white/5 pb-1">Personal Details</h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5 flex items-center gap-1"><Hash size={10} /> Serial No</label>
                                    <input
                                        type="number"
                                        value={serialNumber}
                                        onChange={e => setSerialNumber(e.target.value !== '' ? Number(e.target.value) : '')}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="Serial No"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="e.g. Ramesh Kumar"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Contact Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="10-digit mobile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Alternate Contact Number</label>
                                    <input
                                        type="tel"
                                        value={alternatePhone}
                                        onChange={e => setAlternatePhone(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="Alternate mobile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Email Address (Optional - for staff login)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="staff@sonu-enterprises.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Aadhaar Card No</label>
                                    <input
                                        type="text"
                                        value={aadhaar}
                                        onChange={e => setAadhaar(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="xxxx-xxxx-xxxx"
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Permanent Address</label>
                                    <textarea
                                        rows={2}
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors resize-none"
                                        placeholder="Full residential address"
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Emergency Contact Info</label>
                                    <input
                                        type="text"
                                        value={emergencyContact}
                                        onChange={e => setEmergencyContact(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="Name (Relation) - Phone"
                                    />
                                </div>
                            </div>

                            <h4 className="text-xs uppercase font-black text-luxury-gold tracking-widest border-b border-stone-200 dark:border-white/5 pt-4 pb-1">Employment & Wages</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Role / Designation *</label>
                                    <select
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors cursor-pointer"
                                    >
                                        {ROLES.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Joining Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={joiningDate}
                                        onChange={e => setJoiningDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Salary Scheme *</label>
                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 text-xs text-stone-900 dark:text-white cursor-pointer">
                                            <input
                                                type="radio"
                                                name="salaryType"
                                                checked={salaryType === 'daily'}
                                                onChange={() => setSalaryType('daily')}
                                                className="accent-luxury-gold"
                                            />
                                            <span>Daily Wage</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs text-stone-900 dark:text-white cursor-pointer">
                                            <input
                                                type="radio"
                                                name="salaryType"
                                                checked={salaryType === 'monthly'}
                                                onChange={() => setSalaryType('monthly')}
                                                className="accent-luxury-gold"
                                            />
                                            <span>Fixed Monthly</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">
                                        {salaryType === 'daily' ? 'Standard Base Wage (INR) *' : 'Monthly Salary (INR) *'}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={standardWage}
                                        onChange={e => setStandardWage(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder={salaryType === 'daily' ? "e.g. 750" : "e.g. 25000"}
                                    />
                                </div>

                                {salaryType === 'daily' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Overtime Wage (INR, optional)</label>
                                            <input
                                                type="number"
                                                value={overtimeWage}
                                                onChange={e => setOvertimeWage(Number(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                                placeholder="e.g. 1125"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Double Shift Wage (INR, optional)</label>
                                            <input
                                                type="number"
                                                value={doubleShiftWage}
                                                onChange={e => setDoubleShiftWage(Number(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                                placeholder="e.g. 1500"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Documents Verification</label>
                                    <select
                                        value={documentsStatus}
                                        onChange={e => setDocumentsStatus(e.target.value as 'verified' | 'pending')}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors cursor-pointer"
                                    >
                                        <option value="pending">Pending Verification</option>
                                        <option value="verified">Verified</option>
                                    </select>
                                </div>
                            </div>

                            <h4 className="text-xs uppercase font-black text-luxury-gold tracking-widest border-b border-stone-200 dark:border-white/5 pt-4 pb-1">Bank Account details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Bank Name</label>
                                    <input
                                        type="text"
                                        value={bankName}
                                        onChange={e => setBankName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="e.g. SBI"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">Account Number</label>
                                    <input
                                        type="text"
                                        value={accountNo}
                                        onChange={e => setAccountNo(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="Bank Acc No"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-550 dark:text-stone-400 mb-1.5">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={ifscCode}
                                        onChange={e => setIfscCode(e.target.value.toUpperCase())}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white transition-colors"
                                        placeholder="11 characters"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-stone-200 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2.5 bg-transparent hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold text-stone-500 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-white hover:text-stone-950 transition-all disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    <span>{editingMember ? "Save Profile" : "Register Staff"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
