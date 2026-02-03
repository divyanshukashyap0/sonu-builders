import React from 'react';
import { Mail, Phone, MapPin, Calendar, Tag, User, DollarSign } from 'lucide-react';

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';

interface LeadCardProps {
    name: string;
    email: string;
    phone: string;
    city?: string;
    propertyType?: string;
    status: LeadStatus;
    createdAt: Date;
    estimatedBudget?: string;
    onStatusChange: (status: LeadStatus) => void;
}

const statusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
    new: { label: 'New Lead', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
    contacted: { label: 'Contacted', color: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/30' },
    quoted: { label: 'Quoted', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
    converted: { label: 'Converted', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/30' },
    lost: { label: 'Lost', color: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' }
};

export const LeadCard: React.FC<LeadCardProps> = ({
    name,
    email,
    phone,
    city,
    propertyType,
    status,
    createdAt,
    estimatedBudget,
    onStatusChange
}) => {
    const config = statusConfig[status];

    return (
        <div className="glass-dark p-6 rounded-xl border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
                    <p className="text-sm text-gray-400">
                        {createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium ${config.bgColor} ${config.color} cursor-pointer`}
                >
                    {Object.entries(statusConfig).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-luxury-gold" />
                    <a href={`mailto:${email}`} className="hover:text-luxury-gold transition-colors">
                        {email}
                    </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-luxury-gold" />
                    <a href={`tel:${phone}`} className="hover:text-luxury-gold transition-colors">
                        {phone}
                    </a>
                </div>
                {city && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                        {city}
                    </div>
                )}
                {propertyType && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Tag className="w-4 h-4 text-luxury-gold" />
                        {propertyType}
                    </div>
                )}
                {estimatedBudget && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <DollarSign className="w-4 h-4 text-luxury-gold" />
                        ₹{estimatedBudget}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold rounded-lg text-sm font-medium transition-colors">
                        Call
                    </button>
                    <button className="flex-1 px-3 py-2 bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold rounded-lg text-sm font-medium transition-colors">
                        Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadCard;
