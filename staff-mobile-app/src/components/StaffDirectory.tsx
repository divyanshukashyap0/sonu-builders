import React, { useState } from 'react';
import { useStaff } from '../hooks/useStaff';
import type { StaffMember, StaffRole } from '../types';
import { 
    Search, Plus, User, Phone, MapPin, 
    Calendar, CheckCircle2, AlertCircle, Edit2, 
    Trash2, X, ShieldAlert, CreditCard, ArrowLeft, Loader2
} from 'lucide-react';

const ROLES: StaffRole[] = [
    'Carpenter', 'Painter', 'Electrician', 'POP Worker',
    'Tile Worker', 'Plumber', 'Fabricator', 'Supervisor'
];

interface StaffDirectoryProps {
    onBack: () => void;
}

export default function StaffDirectory({ onBack }: StaffDirectoryProps) {
    const { staff, loading, error, addStaff, updateStaff, deleteStaff } = useStaff();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
    const [detailsMember, setDetailsMember] = useState<StaffMember | null>(null);
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
    const [overtimeWage, setOvertimeWage] = useState(900);
    const [doubleShiftWage, setDoubleShiftWage] = useState(1200);
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
        setDetailsMember(null);
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
                setDetailsMember(prev => prev ? { ...prev, status: nextStatus } : null);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDelete = async (member: StaffMember) => {
        if (window.confirm(`PERMANENTLY DELETE ${member.fullName}? This action is irreversible.`)) {
            try {
                await deleteStaff(member.id);
                setDetailsMember(null);
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
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Staff Directory</h2>
                        <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">Active crew roster ({staff.length})</span>
                    </div>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 bg-[#c5a059] text-black px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-glow-gold transition-all active:scale-95 cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" /> Onboard Staff
                </button>
            </div>

            {/* Filters */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search employee, ID, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 focus:border-[#c5a059]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none text-white placeholder-neutral-500 transition-colors"
                    />
                </div>

                {/* Dropdown Filters */}
                <div className="grid grid-cols-2 gap-2">
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2.5 text-[11px] outline-none text-neutral-300 cursor-pointer"
                    >
                        <option value="All">All Job Roles</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2.5 text-[11px] outline-none text-neutral-300 cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Decrypting Roster...</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredStaff.length > 0 ? (
                        filteredStaff.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => setDetailsMember(member)}
                                className={`bg-neutral-900 border border-white/5 p-4 rounded-xl flex items-center justify-between active:scale-98 transition-transform cursor-pointer ${member.status === 'inactive' ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-950 border border-white/5 flex items-center justify-center">
                                        <User className={`w-5 h-5 ${member.status === 'active' ? 'text-[#c5a059]' : 'text-neutral-500'}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white leading-none mb-1">{member.fullName}</h4>
                                        <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-mono">
                                            {member.employeeId} · {member.role}
                                        </p>
                                        <p className="text-[9px] text-[#c5a059] mt-0.5 uppercase tracking-wider font-bold">
                                            Site: {member.siteAssigned || 'Unallocated'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {member.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="bg-neutral-900 border border-white/5 rounded-xl py-12 text-center text-xs text-neutral-500">
                            No employees found matching criteria.
                        </div>
                    )}
                </div>
            )}

            {/* Profile Details Modal */}
            {detailsMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#c5a059]/10 to-transparent">
                            <div>
                                <h3 className="text-sm font-bold text-white">{detailsMember.fullName}</h3>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">{detailsMember.employeeId}</p>
                            </div>
                            <button onClick={() => setDetailsMember(null)} className="p-1.5 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-5 overflow-y-auto space-y-4 text-xs select-none">
                            <div className="space-y-2 border-b border-white/5 pb-3">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Job Role:</span>
                                    <span className="text-white font-bold">{detailsMember.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Salary Scheme:</span>
                                    <span className="text-white capitalize">{detailsMember.salaryType} ({detailsMember.salaryType === 'daily' ? 'Daily Wage' : 'Monthly Salary'})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Standard Wage:</span>
                                    <span className="text-white font-bold font-mono">₹{detailsMember.standardWage}</span>
                                </div>
                                {detailsMember.salaryType === 'daily' && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Overtime Wage:</span>
                                            <span className="text-white font-mono">₹{detailsMember.overtimeWage || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Double Shift Wage:</span>
                                            <span className="text-white font-mono">₹{detailsMember.doubleShiftWage || 0}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-2 border-b border-white/5 pb-3">
                                <div className="flex items-center gap-1.5 text-neutral-500">
                                    <Phone className="w-3.5 h-3.5" /> Contact Details
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Primary Mob:</span>
                                    <span className="text-white font-mono">{detailsMember.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Alternative Mob:</span>
                                    <span className="text-white font-mono">{detailsMember.alternatePhone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Emergency Contact:</span>
                                    <span className="text-white font-mono">{detailsMember.emergencyContact || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Google Email:</span>
                                    <span className="text-white">{detailsMember.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="space-y-2 border-b border-white/5 pb-3">
                                <div className="flex items-center gap-1.5 text-neutral-500">
                                    <CreditCard className="w-3.5 h-3.5" /> Bank Details & Documents
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Bank Name:</span>
                                    <span className="text-white">{detailsMember.bankDetails?.bankName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Account Number:</span>
                                    <span className="text-white font-mono">{detailsMember.bankDetails?.accountNo || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">IFSC Code:</span>
                                    <span className="text-white font-mono">{detailsMember.bankDetails?.ifscCode || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Aadhaar Card:</span>
                                    <span className="text-white font-mono">{detailsMember.aadhaar || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-500">Verification status:</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${detailsMember.documentsStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        {detailsMember.documentsStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-neutral-500">
                                    <MapPin className="w-3.5 h-3.5" /> Address & Roster Information
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Address:</span>
                                    <span className="text-white max-w-[180px] text-right truncate" title={detailsMember.address || ''}>{detailsMember.address || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Joining Date:</span>
                                    <span className="text-white font-mono">{detailsMember.joiningDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-white/5 bg-neutral-950 flex gap-2.5">
                            <button
                                onClick={() => openEditModal(detailsMember)}
                                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 border border-white/5 cursor-pointer"
                            >
                                <Edit2 className="w-3.5 h-3.5 text-[#c5a059]" /> Edit Profile
                            </button>
                            <button
                                onClick={() => toggleStatus(detailsMember)}
                                className={`flex-1 font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 border border-white/5 cursor-pointer ${detailsMember.status === 'active' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}
                            >
                                {detailsMember.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => handleDelete(detailsMember)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl cursor-pointer"
                                title="Delete Permanently"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden my-6">
                        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-gradient-to-r from-[#c5a059]/10 to-transparent">
                            <div>
                                <h3 className="text-sm font-bold text-white">
                                    {editingMember ? "Edit Employee Profile" : "Onboard Staff Member"}
                                </h3>
                                <p className="text-[9px] uppercase tracking-widest text-[#c5a059] mt-0.5">Roster Profile Matrix</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="e.g. Ramesh Kumar"
                                        className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Serial Number *</label>
                                        <input
                                            type="number"
                                            required
                                            value={serialNumber}
                                            onChange={e => setSerialNumber(e.target.value !== '' ? Number(e.target.value) : '')}
                                            placeholder="e.g. 1"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Job Role *</label>
                                        <select
                                            value={role}
                                            onChange={e => setRole(e.target.value as StaffRole)}
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none text-white cursor-pointer"
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Mobile No. *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="10-digit number"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Alt Mobile</label>
                                        <input
                                            type="tel"
                                            value={alternatePhone}
                                            onChange={e => setAlternatePhone(e.target.value)}
                                            placeholder="Alternative contact"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Google Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="worker@gmail.com"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Joining Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={joiningDate}
                                            onChange={e => setJoiningDate(e.target.value)}
                                            className="w-full px-3 py-2 bg-neutral-950 border border-white/5 rounded-xl outline-none text-white"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-white/5 pt-3 space-y-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059]">Wages & Schemes</span>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Scheme *</label>
                                            <select
                                                value={salaryType}
                                                onChange={e => setSalaryType(e.target.value as 'daily' | 'monthly')}
                                                className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none text-white cursor-pointer"
                                            >
                                                <option value="daily">Daily Wage</option>
                                                <option value="monthly">Monthly Flat</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                                                {salaryType === 'daily' ? 'Standard Wage (Shift)' : 'Monthly Wage (Flat)'} *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={standardWage}
                                                onChange={e => setStandardWage(Number(e.target.value))}
                                                className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                            />
                                        </div>
                                    </div>

                                    {salaryType === 'daily' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Overtime Wage (1.5x)</label>
                                                <input
                                                    type="number"
                                                    value={overtimeWage}
                                                    onChange={e => setOvertimeWage(Number(e.target.value))}
                                                    className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Double Wage (2x)</label>
                                                <input
                                                    type="number"
                                                    value={doubleShiftWage}
                                                    onChange={e => setDoubleShiftWage(Number(e.target.value))}
                                                    className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-white/5 pt-3 space-y-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059]">Bank Details & Aadhaar</span>
                                    
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Bank Name</label>
                                        <input
                                            type="text"
                                            value={bankName}
                                            onChange={e => setBankName(e.target.value)}
                                            placeholder="e.g. State Bank of India"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Account Number</label>
                                            <input
                                                type="text"
                                                value={accountNo}
                                                onChange={e => setAccountNo(e.target.value)}
                                                placeholder="Account No"
                                                className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">IFSC Code</label>
                                            <input
                                                type="text"
                                                value={ifscCode}
                                                onChange={e => setIfscCode(e.target.value)}
                                                placeholder="IFSC Code"
                                                className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">12-Digit Aadhaar</label>
                                            <input
                                                type="text"
                                                value={aadhaar}
                                                onChange={e => setAadhaar(e.target.value)}
                                                placeholder="0000 0000 0000"
                                                className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Doc Status</label>
                                            <select
                                                value={documentsStatus}
                                                onChange={e => setDocumentsStatus(e.target.value as 'verified' | 'pending')}
                                                className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none text-white cursor-pointer"
                                            >
                                                <option value="pending">Pending Verification</option>
                                                <option value="verified">Verified</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-white/5 pt-3 space-y-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#c5a059]">Other Metadata</span>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            placeholder="Employee residential address"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Emergency Contact</label>
                                        <input
                                            type="text"
                                            value={emergencyContact}
                                            onChange={e => setEmergencyContact(e.target.value)}
                                            placeholder="Emergency relative name & number"
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl py-2.5 text-[10px] font-bold text-neutral-400 hover:text-white uppercase transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-grow flex items-center justify-center gap-1 bg-[#c5a059] text-black font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider shadow-glow-gold transition-all cursor-pointer"
                                >
                                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                    <span>{editingMember ? "Save Profile" : "Add Worker"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
