import React, { useState } from 'react';
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    X,
    Save,
    Image as ImageIcon
} from 'lucide-react';
import { useTeam } from '../../hooks/useTeam';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import { TeamMember } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryImageInput from '../../components/admin/media/CloudinaryImageInput';

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-luxury-obsidian rounded-xl shadow-2xl w-full max-w-lg border border-luxury-gold/20 overflow-hidden"
                data-lenis-prevent
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
                    <h3 className="text-xl font-serif font-bold text-luxury-charcoal dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

const Team: React.FC = () => {
    const { team, loading, error, addMember, updateMember, deleteMember } = useTeam();
    const { confirmDelete } = useConfirmDelete();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '', role: '', email: '', phone: '', image: '', bio: ''
    });
    const [actionLoading, setActionLoading] = useState(false);

    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData(member);
        } else {
            setEditingMember(null);
            setFormData({ name: '', role: '', email: '', phone: '', image: '', bio: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
        setFormData({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (editingMember) {
                await updateMember(editingMember.id, formData);
            } else {
                await addMember(formData as TeamMember);
            }
            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert("Failed to save member.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        confirmDelete(
            async () => {
                await deleteMember(id);
            },
            {
                firstMessage: "Are you sure you want to remove this team member?",
                secondMessage: "ARE YOU ABSOLUTELY SURE? This will permanently remove their profile from the team page.",
                successMessage: "Team member removed."
            }
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Team Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage access and profiles for your staff.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-luxury-gold text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all"
                >
                    <Plus size={18} />
                    <span>Add Member</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-luxury-obsidian p-4 rounded-xl border border-luxury-gold/10 flex items-center gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-white/5 text-left text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            <AnimatePresence>
                                {filteredTeam.length > 0 ? (
                                    filteredTeam.map((member) => (
                                        <motion.tr
                                            key={member.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold text-sm">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-luxury-charcoal dark:text-white text-sm">{member.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-luxury-gold/10 text-luxury-gold">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div>{member.email}</div>
                                                <div className="text-xs">{member.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(member)}
                                                        className="p-2 text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(member.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No team members found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingMember ? "Edit Team Member" : "Add New Member"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all dark:text-white"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Designation</label>
                        <input
                            type="text"
                            required
                            value={formData.role || ''}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all dark:text-white"
                            placeholder="e.g. Senior Architect"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <CloudinaryImageInput
                            label="Profile Image"
                            value={formData.image || ''}
                            onChange={url => setFormData({ ...formData, image: url })}
                            folder="team"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio (Optional)</label>
                        <textarea
                            rows={3}
                            value={formData.bio || ''}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all dark:text-white"
                        ></textarea>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="flex items-center gap-2 bg-luxury-gold text-white px-6 py-2 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all disabled:opacity-50"
                        >
                            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {editingMember ? 'Update Member' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Team;
