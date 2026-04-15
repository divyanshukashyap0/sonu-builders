import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, Send, CheckCircle, ArrowRight, User, Phone, MapPin, Calendar } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCompanyData } from '../../hooks/useCompanyData';
import { RoomEstimate } from '../../types';

const roomTypes = [
    { id: 'living', name: 'Living Room', icon: '🛋️', defaultArea: 250 },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️', defaultArea: 180 },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', defaultArea: 120 },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿', defaultArea: 60 },
    { id: 'dining', name: 'Dining Room', icon: '🍽️', defaultArea: 150 },
    { id: 'study', name: 'Study Room', icon: '📚', defaultArea: 120 }
];

const pricePerSqFt = {
    basic: 1200,
    premium: 2000,
    luxury: 3500
};

const levelDetails = {
    basic: { name: 'Essential', description: 'Functional & reliable' },
    premium: { name: 'Premium', description: 'Designer aesthetics' },
    luxury: { name: 'Luxury', description: 'Bespoke & Imported' }
};

const presets = [
    { name: '1BHK Basic', rooms: [{ id: 'living', area: 200, level: 'basic' }, { id: 'bedroom', area: 150, level: 'basic' }, { id: 'kitchen', area: 80, level: 'basic' }, { id: 'bathroom', area: 40, level: 'basic' }] },
    { name: '2BHK Premium', rooms: [{ id: 'living', area: 300, level: 'premium' }, { id: 'bedroom', area: 180, level: 'premium' }, { id: 'bedroom', area: 180, level: 'premium' }, { id: 'kitchen', area: 120, level: 'premium' }, { id: 'bathroom', area: 60, level: 'premium' }] },
    { name: '3BHK Luxury', rooms: [{ id: 'living', area: 450, level: 'luxury' }, { id: 'bedroom', area: 220, level: 'luxury' }, { id: 'bedroom', area: 200, level: 'luxury' }, { id: 'bedroom', area: 180, level: 'luxury' }, { id: 'kitchen', area: 150, level: 'luxury' }, { id: 'bathroom', area: 80, level: 'luxury' }, { id: 'dining', area: 180, level: 'luxury' }] }
];

export const BudgetEstimator: React.FC = () => {
    const [rooms, setRooms] = useState<RoomEstimate[]>([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [currentArea, setCurrentArea] = useState('');
    const [currentLevel, setCurrentLevel] = useState<'basic' | 'premium' | 'luxury'>('premium');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const { contactInfo } = useCompanyData();

    const [leadData, setLeadData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        timeline: '1-3 months'
    });

    useEffect(() => {
        const detectCity = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.city) setLeadData(prev => ({ ...prev, city: data.city }));
            } catch (error) {}
        };
        detectCity();
    }, []);

    const addRoom = () => {
        if (!currentRoom || !currentArea) return;
        const newRoom: RoomEstimate = {
            name: roomTypes.find(r => r.id === currentRoom)?.name || '',
            area: parseInt(currentArea),
            level: currentLevel
        };
        setRooms([...rooms, newRoom]);
        setCurrentRoom('');
        setCurrentArea('');
    };

    const applyPreset = (preset: typeof presets[0]) => {
        const newRooms: RoomEstimate[] = preset.rooms.map(p => ({
            name: roomTypes.find(rt => rt.id === p.id)?.name || '',
            area: p.area,
            level: p.level as any
        }));
        setRooms(newRooms);
    };

    const total = rooms.reduce((acc, room) => acc + (room.area * pricePerSqFt[room.level]), 0);
    const gst = total * 0.18;
    const grandTotal = total + gst;

    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const finalEstimate = {
                userName: leadData.name,
                userPhone: leadData.phone,
                userEmail: leadData.email,
                city: leadData.city,
                timeline: leadData.timeline,
                rooms: rooms,
                totalBudget: grandTotal,
                status: 'New',
                createdAt: serverTimestamp()
            };

            // 1. Save to Firestore
            await addDoc(collection(db, 'estimates'), finalEstimate);

            // 2. Submit to FormSubmit
            const form = document.createElement('form');
            form.action = `https://formsubmit.co/${encodeURIComponent(contactInfo.email)}`;
            form.method = 'POST';
            
            const payload = {
                Name: leadData.name,
                Phone: leadData.phone,
                City: leadData.city,
                Timeline: leadData.timeline,
                TotalEstimate: formatCurrency(grandTotal),
                Breakdown: rooms.map(r => `${r.name} (${r.area}sqft - ${r.level})`).join(', '),
                Source: 'Enhanced Project Estimator'
            };

            for (const [key, value] of Object.entries(payload)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            }

            const configs = { '_subject': `💰 New High-Value Estimate from ${leadData.name}`, '_captcha': 'false' };
            for (const [key, value] of Object.entries(configs)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }
            document.body.appendChild(form);
            const formData = new FormData(form);
            fetch(form.action, { method: 'POST', body: formData, mode: 'no-cors' });
            document.body.removeChild(form);

            setIsSuccess(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white dark:bg-luxury-obsidian p-12 rounded-2xl shadow-luxury text-center border border-luxury-gold/20">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white mb-4">Estimate Delivered</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    We've sent a professional quote to your details. Our design consultant will call you shortly to discuss your <span className="font-bold text-luxury-gold">{formatCurrency(grandTotal)}</span> project.
                </p>
                <div className="flex justify-center gap-4">
                    <a href="/" className="px-8 py-3 bg-luxury-gold text-white rounded-lg font-bold">Back to Home</a>
                    <a href="/gallery" className="px-8 py-3 border border-luxury-gold text-luxury-gold rounded-lg font-bold">Inspiration Gallery</a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Presets Header */}
            <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm overflow-x-auto">
                <div className="flex items-center gap-6 min-w-max">
                    <span className="text-sm font-bold uppercase tracking-widest text-luxury-gold flex items-center gap-2">
                        <ArrowRight size={16} /> Quick Start Presets:
                    </span>
                    {presets.map(p => (
                        <button
                            key={p.name}
                            onClick={() => applyPreset(p)}
                            className="px-4 py-2 border border-luxury-gold/20 rounded-lg text-sm font-semibold hover:bg-luxury-gold hover:text-white transition-all text-luxury-charcoal dark:text-gray-300"
                        >
                            {p.name}
                        </button>
                    ))}
                    <button onClick={() => setRooms([])} className="text-xs text-red-500 hover:underline">Clear All</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-luxury-obsidian rounded-2xl shadow-luxury p-8 border border-luxury-gold/10">
                        <div className="flex items-center gap-3 mb-8">
                            <Calculator className="w-6 h-6 text-luxury-gold" />
                            <h3 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Build Your Space</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pick a Room</label>
                                <select 
                                    value={currentRoom} 
                                    onChange={e => {
                                        const room = roomTypes.find(r => r.id === e.target.value);
                                        if (room) {
                                            setCurrentRoom(room.id);
                                            setCurrentArea(String(room.defaultArea));
                                        } else {
                                            setCurrentRoom('');
                                        }
                                    }}
                                    className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg outline-none focus:border-luxury-gold text-white appearance-none"
                                >
                                    <option value="" className="bg-luxury-charcoal text-gray-400">Choose Room...</option>
                                    {roomTypes.map(r => <option key={r.id} value={r.id} className="bg-luxury-charcoal text-white">{r.icon} {r.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Approx Area (sqft)</label>
                                <input 
                                    type="number" 
                                    value={currentArea} 
                                    onChange={e => setCurrentArea(e.target.value)}
                                    placeholder="e.g. 250"
                                    className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-gold/20 rounded-lg outline-none focus:border-luxury-gold text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Material Quality</label>
                            <div className="grid grid-cols-3 gap-4">
                                {(['basic', 'premium', 'luxury'] as const).map(l => (
                                    <button 
                                        key={l}
                                        onClick={() => setCurrentLevel(l)}
                                        className={`p-4 border-2 rounded-xl text-left transition-all ${currentLevel === l ? 'border-luxury-gold bg-luxury-gold/10' : 'border-gray-100 dark:border-white/10 opacity-60'}`}
                                    >
                                        <div className="font-bold text-sm text-luxury-charcoal dark:text-white">{levelDetails[l].name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">₹{pricePerSqFt[l]}/sqft</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={addRoom}
                            disabled={!currentRoom || !currentArea}
                            className="w-full py-4 bg-luxury-charcoal text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                        >
                            + Add to Estimate
                        </button>
                    </div>

                    {rooms.length > 0 && (
                        <div className="bg-white dark:bg-luxury-obsidian rounded-2xl shadow-luxury p-8 border border-luxury-gold/10">
                           <h4 className="text-lg font-bold text-luxury-charcoal dark:text-white mb-6">Current Inventory</h4>
                           <div className="space-y-3">
                                {rooms.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 group">
                                        <div>
                                            <p className="font-bold text-luxury-charcoal dark:text-white">{r.name} <span className="text-xs font-normal text-luxury-gold ml-2">{levelDetails[r.level].name}</span></p>
                                            <p className="text-xs text-gray-500">{r.area} sqft • {formatCurrency(r.area * pricePerSqFt[r.level])}</p>
                                        </div>
                                        <button onClick={() => setRooms(rooms.filter((_, idx) => idx !== i))} className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Minus size={18}/></button>
                                    </div>
                                ))}
                           </div>
                        </div>
                    )}
                </div>

                {/* Summary & Form */}
                <div className="space-y-6">
                    <div className="bg-luxury-charcoal text-white rounded-2xl shadow-luxury p-8 sticky top-24 border border-white/5">
                        <h4 className="text-xl font-serif font-bold mb-8">Summary</h4>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span className="text-white font-mono">{formatCurrency(total)}</span></div>
                            <div className="flex justify-between text-sm text-gray-400"><span>GST (18%)</span><span className="text-white font-mono">{formatCurrency(gst)}</span></div>
                            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                                <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold">Quote Value</span>
                                <span className="text-2xl font-serif font-bold text-luxury-gold">{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>

                        {!showLeadForm ? (
                            <button 
                                onClick={() => rooms.length > 0 && setShowLeadForm(true)}
                                disabled={rooms.length === 0}
                                className="w-full py-4 bg-luxury-gold text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-glow-gold transition-all flex items-center justify-center gap-2 group"
                            >
                                Validate & Send Quote <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/10">
                                <p className="text-xs text-luxury-gold font-bold uppercase tracking-widest mb-4">Finalize Details</p>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input required value={leadData.name} onChange={e => setLeadData(p => ({...p, name: e.target.value}))} placeholder="Your Name" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-luxury-gold text-sm" />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input required type="tel" value={leadData.phone} onChange={e => setLeadData(p => ({...p, phone: e.target.value}))} placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-luxury-gold text-sm" />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input value={leadData.city} onChange={e => setLeadData(p => ({...p, city: e.target.value}))} placeholder="Your City" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-luxury-gold text-sm" />
                                    </div>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <select value={leadData.timeline} onChange={e => setLeadData(p => ({...p, timeline: e.target.value}))} className="w-full pl-10 pr-4 py-3 bg-luxury-charcoal border border-white/10 rounded-lg outline-none focus:border-luxury-gold text-sm appearance-none text-white">
                                            <option value="immediate" className="bg-luxury-charcoal text-white">Starting Immediately</option>
                                            <option value="1-3 months" className="bg-luxury-charcoal text-white">1-3 Months</option>
                                            <option value="planning" className="bg-luxury-charcoal text-white">Just Planning</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 mt-4 bg-luxury-gold text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-glow-gold transition-all"
                                >
                                    {isSubmitting ? 'Processing...' : 'Generate professional Quote'}
                                </button>
                                <button type="button" onClick={() => setShowLeadForm(false)} className="w-full text-xs text-gray-400 hover:text-white py-2">Edit Room Inventory</button>
                            </form>
                        )}
                        <p className="text-[10px] text-gray-500 mt-6 text-center leading-relaxed italic">
                            By generating this quote, you agree to our terms. This is an algorithmic estimate based on current market rates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetEstimator;
