import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, Send, CheckCircle, ArrowRight, User, Phone, MapPin, Calendar, Download, Layers, Paintbrush, Home, ChevronLeft } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCompanyData } from '../../hooks/useCompanyData';
import { RoomEstimate } from '../../types';
import { useEstimationCosts } from '../../hooks/useEstimationCosts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

const roomTypes = [
    { id: 'living', name: 'Living Room', icon: '🛋️', defaultArea: 250 },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️', defaultArea: 180 },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', defaultArea: 120 },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿', defaultArea: 60 },
    { id: 'dining', name: 'Dining Room', icon: '🍽️', defaultArea: 150 },
    { id: 'study', name: 'Study Room', icon: '📚', defaultArea: 120 }
];

export const BudgetEstimator: React.FC = () => {
    const { costs, loading: costsLoading } = useEstimationCosts();
    const [rooms, setRooms] = useState<RoomEstimate[]>([]);
    const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
    const [currentRoom, setCurrentRoom] = useState('');
    const [currentArea, setCurrentArea] = useState('');
    
    // Detailed fields
    const [currentTiles, setCurrentTiles] = useState('vitrified');
    const [currentColor, setCurrentColor] = useState('plasticEmulsion');
    const [hasTvUnit, setHasTvUnit] = useState(false);
    const [hasKitchen, setHasKitchen] = useState(false);
    const [wardrobeSize, setWardrobeSize] = useState('0');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const { contactInfo, name: companyName } = useCompanyData();

    const [leadData, setLeadData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        timeline: '1-3 months'
    });

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                // Try ip-api.com as it's more lenient for development/CORS
                const response = await fetch('https://demo.ip-api.com/json/').catch(() => null);
                if (response && response.ok) {
                    const data = await response.json();
                    if (data.city) setLeadData(prev => ({ ...prev, city: data.city }));
                } else {
                    setLeadData(prev => ({ ...prev, city: 'Mumbai' }));
                }
            } catch (error) {
                setLeadData(prev => ({ ...prev, city: 'Mumbai' }));
            }
        };
        fetchGeoData();
    }, []);

    const selectedStyle = costs?.styleTiers?.find(t => t.id === selectedStyleId);

    const calculateRoomCost = (room: RoomEstimate) => {
        if (!costs || !selectedStyle) return 0;
        
        // Use price from the selected style tier
        let base = room.area * selectedStyle.pricePerSqFt;
        
        // Add Tile cost
        const tileRate = (costs.tiles as any)[room.tiles || 'vitrified'] || 0;
        base += room.area * tileRate;
        
        // Add Paint cost
        const paintRate = (costs.color as any)[room.color || 'plasticEmulsion'] || 0;
        base += room.area * paintRate;
        
        // Add Fixed Items
        if (room.hasTvUnit) base += costs.fixedItems.tvUnit;
        if (room.hasModularKitchen) base += costs.fixedItems.modularKitchenBase;
        if (room.wardrobeSize) base += room.wardrobeSize * costs.fixedItems.wardrobePerSqFt;
        
        return base;
    };

    const addRoom = () => {
        if (!currentRoom || !currentArea || !selectedStyleId) return;
        const newRoom: RoomEstimate = {
            name: roomTypes.find(r => r.id === currentRoom)?.name || '',
            area: parseInt(currentArea),
            level: 'premium', // Defaulting since we use selectedStyle price now
            tiles: currentTiles,
            color: currentColor,
            hasTvUnit: hasTvUnit,
            hasModularKitchen: hasKitchen,
            wardrobeSize: parseInt(wardrobeSize)
        };
        setRooms([...rooms, newRoom]);
        
        // Reset specific fields
        setCurrentRoom('');
        setCurrentArea('');
        setHasTvUnit(false);
        setHasKitchen(false);
        setWardrobeSize('0');
    };

    const total = rooms.reduce((acc, room) => acc + calculateRoomCost(room), 0);
    const gstRate = costs?.gstRate || 18;
    const gst = total * (gstRate / 100);
    const grandTotal = total + gst;

    const formatCurrency = (val: number) => {
        return `₹${val.toLocaleString('en-IN')}`;
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const gold = [212, 175, 55]; // #D4AF37
        const charcoal = [26, 26, 26]; // #1A1A1A

        // 1. Header & Branding
        doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(companyName.toUpperCase(), 20, 25);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('PREMIUM PROJECT ESTIMATE', 20, 32);

        // 2. User Info
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Estimate For:', 20, 55);
        doc.setFont('helvetica', 'normal');
        doc.text(leadData.name, 20, 62);
        doc.text(`Phone: ${leadData.phone}`, 20, 69);
        doc.text(`Location: ${leadData.city}`, 20, 76);
        doc.text(`Style Selected: ${selectedStyle?.name || 'Custom'}`, 20, 83);
        
        doc.text('Date:', 150, 55);
        doc.text(new Date().toLocaleDateString(), 150, 62);
        doc.text('Estimate ID:', 150, 69);
        doc.text(`EST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 150, 76);

        // 3. Table
        const tableData = rooms.map(r => [
            r.name,
            `${r.area} sqft`,
            selectedStyle?.name || 'Custom',
            `${r.tiles || 'N/A'}\n${r.color || 'N/A'}`,
            formatCurrency(calculateRoomCost(r))
        ]);

        autoTable(doc, {
            startY: 95,
            head: [['Room / Space', 'Area', 'Style Tier', 'Material Details', 'Amount']],
            body: tableData,
            headStyles: { fillColor: gold, textColor: [255, 255, 255], fontStyle: 'bold' },
            bodyStyles: { textColor: charcoal },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { left: 20, right: 20 }
        });

        // 4. Summary
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.line(120, finalY, 190, finalY);
        
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', 120, finalY + 10);
        doc.text(formatCurrency(total), 160, finalY + 10);
        
        doc.text(`GST (${gstRate}%):`, 120, finalY + 18);
        doc.text(formatCurrency(gst), 160, finalY + 18);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.text('Grand Total:', 120, finalY + 30);
        doc.text(formatCurrency(grandTotal), 160, finalY + 30);

        // 5. Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`This is an algorithmic estimate provided by ${companyName}. Final costs may vary based on actual site measurements and material selection.`, 20, 285);

        doc.save(`${leadData.name.replace(/\s/g, '_')}_Estimate.pdf`);
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
                address: leadData.address,
                timeline: leadData.timeline,
                rooms: rooms,
                selectedStyle: selectedStyle?.name,
                totalBudget: grandTotal,
                status: 'New',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'estimates'), finalEstimate);
            setIsSuccess(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (costsLoading) return <div className="p-20 text-center animate-pulse text-luxury-gold font-bold">Initializing Premium Estimator...</div>;

    if (isSuccess) {
        return (
            <div className="bg-white dark:bg-luxury-obsidian p-12 rounded-2xl shadow-luxury text-center border border-luxury-gold/20">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white mb-4">Estimate Delivered</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    We've saved your professional quote. You can now download the PDF breakdown or our team will contact you at <span className="text-luxury-gold font-bold">{leadData.phone}</span>.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={generatePDF} className="flex items-center justify-center gap-2 px-8 py-4 bg-luxury-gold text-white rounded-xl font-bold shadow-glow-gold hover:scale-105 transition-all">
                        <Download size={20} /> Download PDF Estimate
                    </button>
                    <a href="/" className="px-8 py-4 border border-luxury-gold text-luxury-gold rounded-xl font-bold hover:bg-luxury-gold/5 transition-all">Back to Home</a>
                </div>
            </div>
        );
    }

    if (!selectedStyleId) {
        return (
            <div className="max-w-6xl mx-auto py-12 px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-luxury-charcoal dark:text-white mb-4">Select Your Design Inspiration</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Choose a style that resonates with your vision. Each selection comes with a curated budget tier to ensure quality and aesthetics.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {costs?.styleTiers?.map(tier => (
                        <motion.button
                            whileHover={{ y: -10 }}
                            key={tier.id}
                            onClick={() => setSelectedStyleId(tier.id)}
                            className="group relative h-[450px] rounded-3xl overflow-hidden border border-luxury-gold/10 shadow-luxury"
                        >
                            <img src={tier.image} alt={tier.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-luxury-gold font-bold uppercase tracking-widest text-xs">Starts from ₹{tier.pricePerSqFt}/sqft</span>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-luxury-gold transition-colors">
                                        <ArrowRight size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-4 pb-20">
            <button onClick={() => setSelectedStyleId(null)} className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold transition-colors font-bold uppercase tracking-widest text-xs">
                <ChevronLeft size={16} /> Change Design Style
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-luxury-obsidian rounded-2xl shadow-luxury p-8 border border-luxury-gold/10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Calculator className="w-6 h-6 text-luxury-gold" />
                                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Customize Your {selectedStyle?.name}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Current Base Rate</p>
                                <p className="text-luxury-gold font-bold">₹{selectedStyle?.pricePerSqFt}/sqft</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Space Type</label>
                                <select 
                                    value={currentRoom} 
                                    onChange={e => {
                                        const room = roomTypes.find(r => r.id === e.target.value);
                                        if (room) {
                                            setCurrentRoom(room.id);
                                            setCurrentArea(String(room.defaultArea));
                                            setHasKitchen(room.id === 'kitchen');
                                        } else {
                                            setCurrentRoom('');
                                        }
                                    }}
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-white/5 border border-luxury-gold/20 rounded-xl outline-none focus:border-luxury-gold dark:text-white appearance-none"
                                >
                                    <option value="">Select Room...</option>
                                    {roomTypes.map(r => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Floor Area (SqFt)</label>
                                <input 
                                    type="number" 
                                    value={currentArea} 
                                    onChange={e => setCurrentArea(e.target.value)}
                                    placeholder="e.g. 250"
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-white/5 border border-luxury-gold/20 rounded-xl outline-none focus:border-luxury-gold dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <Layers size={14} className="text-luxury-gold" /> Flooring & Tiles
                                </label>
                                <select 
                                    value={currentTiles} 
                                    onChange={e => setCurrentTiles(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-white/5 border border-luxury-gold/20 rounded-xl outline-none focus:border-luxury-gold dark:text-white"
                                >
                                    {Object.keys(costs?.tiles || {}).map(t => <option key={t} value={t}>{t.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <Paintbrush size={14} className="text-luxury-gold" /> Painting Style
                                </label>
                                <select 
                                    value={currentColor} 
                                    onChange={e => setCurrentColor(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-white/5 border border-luxury-gold/20 rounded-xl outline-none focus:border-luxury-gold dark:text-white"
                                >
                                    {Object.keys(costs?.color || {}).map(c => <option key={c} value={c}>{c.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <label className="flex items-center gap-3 p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-xl cursor-pointer hover:bg-luxury-gold/10 transition-colors">
                                <input type="checkbox" checked={hasTvUnit} onChange={e => setHasTvUnit(e.target.checked)} className="w-5 h-5 accent-luxury-gold" />
                                <span className="text-sm font-bold dark:text-white">TV Unit</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-xl cursor-pointer hover:bg-luxury-gold/10 transition-colors">
                                <input type="checkbox" checked={hasKitchen} onChange={e => setHasKitchen(e.target.checked)} className="w-5 h-5 accent-luxury-gold" />
                                <span className="text-sm font-bold dark:text-white">Modular Kitchen</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Wardrobe Size (SqFt)</label>
                                <input 
                                    type="number" 
                                    value={wardrobeSize} 
                                    onChange={e => setWardrobeSize(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-luxury-gold/20 rounded-lg outline-none focus:border-luxury-gold dark:text-white text-sm"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={addRoom}
                            disabled={!currentRoom || !currentArea}
                            className="w-full py-5 bg-luxury-charcoal text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <Plus size={20} /> Add to Master Inventory
                        </button>
                    </div>

                    {/* Inventory List */}
                    {rooms.length > 0 && (
                        <div className="bg-white dark:bg-luxury-obsidian rounded-2xl shadow-luxury p-8 border border-luxury-gold/10">
                           <h4 className="text-lg font-serif font-bold text-luxury-charcoal dark:text-white mb-8 border-b border-luxury-gold/10 pb-4">Project Inventory</h4>
                           <div className="space-y-4">
                                {rooms.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-luxury-gold/10 group animate-slide-up">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center text-2xl">
                                                {roomTypes.find(rt => rt.name === r.name)?.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-luxury-charcoal dark:text-white text-lg">{r.name}</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="text-[10px] font-bold uppercase bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded-full">{selectedStyle?.name}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase font-bold">{r.area} SqFt</span>
                                                    {r.hasTvUnit && <span className="text-[10px] text-luxury-gold uppercase font-bold">+ TV Unit</span>}
                                                    {r.hasModularKitchen && <span className="text-[10px] text-luxury-gold uppercase font-bold">+ Kitchen</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-xl text-luxury-charcoal dark:text-white font-mono">{formatCurrency(calculateRoomCost(r))}</p>
                                                <button onClick={() => setRooms(rooms.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:underline mt-1">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </div>
                    )}
                </div>

                {/* Calculation Sidebar */}
                <div className="space-y-6">
                    <div className="bg-luxury-charcoal text-white rounded-3xl shadow-2xl p-8 sticky top-24 border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                        
                        <h4 className="text-2xl font-serif font-bold mb-10 relative">Investment Summary</h4>
                        
                        <div className="space-y-6 mb-10 relative">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Project Subtotal</span>
                                <span className="text-white font-mono">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>GST ({gstRate}%)</span>
                                <span className="text-white font-mono">{formatCurrency(gst)}</span>
                            </div>
                            <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-luxury-gold uppercase tracking-[0.2em] text-[10px] font-bold">Estimated Quote</span>
                                    <span className="text-3xl font-serif font-bold text-luxury-gold mt-1">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>
                        </div>

                        {!showLeadForm ? (
                            <button 
                                onClick={() => rooms.length > 0 && setShowLeadForm(true)}
                                disabled={rooms.length === 0}
                                className="w-full py-5 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest hover:shadow-glow-gold transition-all flex items-center justify-center gap-3 group disabled:opacity-30"
                            >
                                Send Quote to Email <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5 pt-6 border-t border-white/10 animate-fade-in">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input required value={leadData.name} onChange={e => setLeadData(p => ({...p, name: e.target.value}))} placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-luxury-gold text-sm" />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input required type="tel" value={leadData.phone} onChange={e => setLeadData(p => ({...p, phone: e.target.value}))} placeholder="Phone Number" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-luxury-gold text-sm" />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input required value={leadData.city} onChange={e => setLeadData(p => ({...p, city: e.target.value}))} placeholder="City / Project Location" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-luxury-gold text-sm" />
                                    </div>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <select value={leadData.timeline} onChange={e => setLeadData(p => ({...p, timeline: e.target.value}))} className="w-full pl-12 pr-4 py-4 bg-luxury-charcoal border border-white/10 rounded-xl outline-none focus:border-luxury-gold text-sm appearance-none text-white">
                                            <option value="immediate">Starting Immediately</option>
                                            <option value="1-3 months">1-3 Months</option>
                                            <option value="planning">Just Planning</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 mt-4 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest hover:shadow-glow-gold transition-all shadow-xl"
                                >
                                    {isSubmitting ? 'Securing Estimate...' : 'Confirm & Save Quote'}
                                </button>
                                <button type="button" onClick={() => setShowLeadForm(false)} className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white py-2">Back to Inventory</button>
                            </form>
                        )}
                        
                        <div className="mt-8 flex items-center justify-center gap-4 border-t border-white/5 pt-8">
                            <Home className="text-luxury-gold/50" size={20} />
                            <Paintbrush className="text-luxury-gold/50" size={20} />
                            <Calculator className="text-luxury-gold/50" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetEstimator;
