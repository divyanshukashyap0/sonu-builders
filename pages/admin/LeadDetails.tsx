import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    FileText,
    MessageSquare,
    Clock,
    Loader2,
    Trash2
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { motion } from 'framer-motion';
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const LeadDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<LeadStatus>('New');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const unsubscribe = onSnapshot(doc(db, 'leads', id), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setLead({
                    id: docSnap.id,
                    ...data,
                    createdAt: typeof data.createdAt?.toDate === 'function'
                        ? data.createdAt.toDate()
                        : new Date(data.createdAt || Date.now())
                } as Lead);
                setStatus(data.status as LeadStatus);
            } else {
                // Handle 404
                setLead(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    const handleStatusChange = async (newStatus: LeadStatus) => {
        if (!id) return;
        try {
            await updateDoc(doc(db, 'leads', id), { status: newStatus });
            setStatus(newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
            setIsDeleting(true);
            try {
                await deleteDoc(doc(db, 'leads', id));
                navigate('/admin/leads');
            } catch (error) {
                console.error("Error deleting lead:", error);
                alert("Failed to delete lead. Please try again.");
                setIsDeleting(false);
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        </div>
    );

    if (!lead) return <div className="p-8 text-center text-gray-500">Lead not found.</div>;

    const statusOptions: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/admin/leads')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">{lead.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lead ID: #{lead.id}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-luxury-gold"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <button className="bg-luxury-gold text-white px-4 py-2 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all">
                        Edit Lead
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-luxury-charcoal dark:text-white mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-luxury-gold" />
                            Project Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Project Type</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">{lead.projectType}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Budget Range</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">{lead.budget || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Source</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">{lead.source || 'Direct'}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Created At</label>
                                <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">{lead.createdAt instanceof Date ? lead.createdAt.toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            <label className="text-xs uppercase text-gray-400 font-bold tracking-wider">Notes / Requirements</label>
                            <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                                {lead.notes || "No notes added yet."}
                            </p>
                        </div>
                    </div>

                    {/* Timeline Placeholder */}
                    <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 p-6 shadow-sm opacity-60">
                        <h3 className="text-lg font-bold text-luxury-charcoal dark:text-white mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-luxury-gold" />
                            Activity Timeline
                        </h3>
                        <p className="text-sm text-gray-500">No recent activity recorded.</p>
                    </div>
                </motion.div>

                {/* Sidebar Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Contact Info */}
                    <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-luxury-charcoal dark:text-white mb-4">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-400 uppercase">Email</p>
                                    <a href={`mailto:${lead.email}`} className="text-sm font-medium text-luxury-charcoal dark:text-white truncate block hover:text-luxury-gold transition-colors">
                                        {lead.email}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mr-3">
                                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Phone</p>
                                    <a href={`tel:${lead.phone}`} className="text-sm font-medium text-luxury-charcoal dark:text-white hover:text-luxury-gold transition-colors">
                                        {lead.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mr-3">
                                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Location</p>
                                    <p className="text-sm font-medium text-luxury-charcoal dark:text-white">
                                        Mumbai, India
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    const hour = new Date().getHours();
                                    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                                    const message = encodeURIComponent(`${greeting} ${lead.name},\n\nI hope you're doing well. This is Sonu Singh from Sonu Enterprises  .\n\nI'm following up on your inquiry for a ${lead.projectType} project. I've reviewed your requirements and would love to discuss the details further.\n\nWhen would be a good time to connect?\n\nBest regards,\nSonu Singh`);
                                    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                                }}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                                <MessageSquare size={14} /> WhatsApp
                            </button>
                            <button
                                onClick={() => {
                                    const hour = new Date().getHours();
                                    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                                    const subject = encodeURIComponent(`Discussion regarding your ${lead.projectType} Project`);
                                    const body = encodeURIComponent(`${greeting} ${lead.name},\n\nI hope you're having a productive day.\n\nThis is Sonu Singh from Sonu Enterprises  . I'm following up on your inquiry for your ${lead.projectType} project (Budget: ${lead.budget || 'To be discussed'}).\n\nI have reviewed your notes: "${lead.notes || 'No specific notes'}"\n\nPlease let me know a convenient time for a brief call to discuss the next steps.\n\nBest regards,\n\nSonu Singh\nSonu Enterprises  `);
                                    window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
                                }}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                                <Mail size={14} /> Email
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LeadDetails;
