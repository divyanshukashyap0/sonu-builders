import React, { useState } from 'react';
import ServiceManager from '../../components/admin/ServiceManager';
import { SERVICES } from '../../constants';
import { useServices } from '../../hooks/useServices';
import { RefreshCcw, Check, Loader2 } from 'lucide-react';

const AdminServices: React.FC = () => {
    const { services, addService } = useServices();
    const [syncing, setSyncing] = useState(false);
    const [synced, setSynced] = useState(false);

    const syncDefaults = async () => {
        if (!window.confirm('This will add all default services to your database. Duplicate services might be created. Continue?')) return;

        setSyncing(true);
        try {
            for (const service of SERVICES) {
                const { id, ...serviceData } = service;
                await addService(serviceData as any);
            }
            setSynced(true);
            setTimeout(() => setSynced(false), 3000);
        } catch (error) {
            console.error('Error syncing services:', error);
            alert('Failed to sync services.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Service Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage all your service categories, categories, and detailed content.</p>
                </div>
                {services.length === 0 && (
                    <button
                        onClick={syncDefaults}
                        disabled={syncing}
                        className="flex items-center gap-2 bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold px-4 py-2 rounded-lg transition-all border border-luxury-gold/20 font-bold text-xs"
                    >
                        {syncing ? <Loader2 size={14} className="animate-spin" /> : (synced ? <Check size={14} /> : <RefreshCcw size={14} />)}
                        {syncing ? 'Syncing...' : (synced ? 'Synced' : 'Push Default Services')}
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
                <ServiceManager />
            </div>
        </div>
    );
};

export default AdminServices;
