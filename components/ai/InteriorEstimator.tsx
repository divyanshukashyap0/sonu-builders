import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Phone, Mail, Home, MapPin, DollarSign, Clock, 
    ChevronRight, ChevronLeft, Download, Layers, Paintbrush, 
    Box, Tv, Bath, Lightbulb, Grid, CheckCircle2, Calculator,
    Plus, Trash2, ArrowRight, Sparkles, Building2, Loader2,
    FileText, ShieldCheck
} from 'lucide-react';
import { useEstimationCosts } from '../../hooks/useEstimationCosts';
import { useCompanyData } from '../../hooks/useCompanyData';
import { generateEstimatePDF } from '../../lib/estimatePDF';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- DATA DEFINITIONS ---

const PROPERTY_TYPES = [
    { id: 'apartment', label: 'Apartment', icon: Building2 },
    { id: 'villa', label: 'Villa', icon: Home },
    { id: 'bunglow', label: 'Bunglow', icon: Building2 },
    { id: 'office', label: 'Office', icon: Building2 },
    { id: 'commercial', label: 'Commercial Shop', icon: Grid },
    { id: 'restaurant', label: 'Restaurant', icon: Grid }
];

const CATEGORIES = [
    { id: 'flooring', label: 'Flooring', icon: Layers, options: ['Vitrified Tiles', 'Marble', 'Granite', 'Wooden Flooring', 'SPC Flooring', 'Microcement', 'Kota Stone'] },
    { id: 'walls', label: 'Wall Finish', icon: Paintbrush, options: ['Paint', 'Texture Paint', 'Wallpaper', 'Wall Panels', 'Marble Cladding', 'Wooden Panels'] },
    { id: 'ceiling', label: 'False Ceiling', icon: Grid, options: ['POP Ceiling', 'Gypsum', 'Wooden Ceiling', 'Cove Lighting', 'LED Strip'] },
    { id: 'kitchen', label: 'Modular Kitchen', icon: Box, options: ['Straight', 'L Shape', 'U Shape', 'Parallel', 'Island Kitchen'] },
    { id: 'wardrobe', label: 'Wardrobes', icon: Box, options: ['Sliding', 'Hinged', 'Walk-in'] },
    { id: 'tv_unit', label: 'TV Unit', icon: Tv, options: ['Floating', 'Marble', 'Wooden', 'LED Backlit'] },
    { id: 'bathroom', label: 'Bathroom', icon: Bath, options: ['Premium Tiles', 'Vanity Unit', 'Shower Partition', 'Premium Fittings'] },
    { id: 'lighting', label: 'Lighting', icon: Lightbulb, options: ['Spotlights', 'Chandelier', 'Smart Lighting', 'Decorative Lighting'] }
];

const TIMELINES = ['1-3 Months', '3-6 Months', '6+ Months', 'ASAP'];

// --- COMPONENT ---

export const InteriorEstimator: React.FC = () => {
    const { costs, loading } = useEstimationCosts();
    const { name: companyName } = useCompanyData();

    // --- State ---
    const [step, setStep] = useState(0); 
    const [clientInfo, setClientInfo] = useState({
        name: '',
        phone: '',
        email: '',
        propertyType: 'apartment',
        projectType: 'residential',
        totalArea: '',
        location: '',
        budgetRange: '',
        timeline: '1-3 Months',
        selectedStyleId: ''
    });

    const [selections, setSelections] = useState<Record<string, { material: string, notes: string, cost: number }>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);

    // --- Logic ---

    const totalCost = useMemo(() => {
        let subtotal = 0;
        Object.values(selections).forEach(s => subtotal += s.cost);
        const gst = subtotal * 0.18;
        return { subtotal, gst, total: subtotal + gst };
    }, [selections]);

    const handleCategorySelect = (categoryId: string, option: string) => {
        if (!costs) return;

        let cost = 0;
        const area = parseFloat(clientInfo.totalArea) || 0;

        switch (categoryId) {
            case 'flooring':
                const floorRate = (costs.tiles as any)[option.toLowerCase().split(' ')[0]] || 150;
                cost = area * floorRate;
                break;
            case 'walls':
                const wallRate = (costs.wall as any)[option.toLowerCase().split(' ')[0]] || 60;
                cost = (area * 3) * wallRate; 
                break;
            case 'ceiling':
                const ceilingRate = (costs.falseCeiling as any)[option.toLowerCase().split(' ')[0]] || 120;
                cost = area * ceilingRate;
                break;
            case 'kitchen':
                cost = (costs.kitchen as any)[option.toLowerCase().split(' ')[0]] || 150000;
                break;
            case 'wardrobe':
                cost = 150 * (costs.wardrobe as any)[option.toLowerCase().split(' ')[0] || 'sliding']; 
                break;
            case 'tv_unit':
                cost = (costs.tvUnit as any)[option.toLowerCase().split(' ')[0]] || 45000;
                break;
            case 'bathroom':
                cost = (costs.bathroom as any)[option.toLowerCase().split(' ')[0]] || 25000;
                break;
            case 'lighting':
                cost = (costs.lighting as any)[option.toLowerCase().split(' ')[0]] || 15000;
                break;
        }

        setSelections(prev => ({
            ...prev,
            [categoryId]: { material: option, notes: '', cost }
        }));
    };

    const handleGeneratePDF = async () => {
        setIsGenerating(true);
        setGenerationProgress(10);
        
        try {
            // Simulated progress for luxury effect
            const progressInterval = setInterval(() => {
                setGenerationProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 5;
                });
            }, 300);

            // Save to Firebase
            await addDoc(collection(db, 'leads'), {
                ...clientInfo,
                selections,
                totalEstimate: totalCost.total,
                type: 'Luxury Quotation',
                createdAt: serverTimestamp()
            });

            // Format for PDF
            const pdfData = {
                clientDetails: {
                    name: clientInfo.name,
                    phone: clientInfo.phone,
                    email: clientInfo.email,
                    location: clientInfo.location || 'Site Location Provided',
                    propertyType: clientInfo.propertyType.toUpperCase(),
                    totalArea: parseFloat(clientInfo.totalArea) || 0,
                    timeline: clientInfo.timeline
                },
                selections,
                costs: {
                    items: CATEGORIES.filter(c => selections[c.id]).map(c => {
                        const selection = selections[c.id];
                        // Match category key for optionImages
                        const categoryKey = c.id === 'flooring' ? 'tiles' : 
                                          c.id === 'walls' ? 'wall' : 
                                          c.id === 'ceiling' ? 'falseCeiling' : 
                                          c.id === 'tv_unit' ? 'tvUnit' : c.id;
                        
                        // Match option key for optionImages
                        const optionKey = selection.material.split(' ')[0].toLowerCase();
                        const optionImage = costs.optionImages?.[categoryKey]?.[optionKey] || costs.categoryImages?.[c.id];

                        return {
                            category: c.label,
                            material: selection.material,
                            area: c.id === 'kitchen' ? 'Standard' : `${clientInfo.totalArea} sqft`,
                            rate: selection.cost / (parseFloat(clientInfo.totalArea) || 1),
                            total: selection.cost,
                            categoryImage: optionImage
                        };
                    }),
                    subtotal: totalCost.subtotal,
                    gst: totalCost.gst,
                    grandTotal: totalCost.total
                },
                companyName: companyName
            };

            await generateEstimatePDF(pdfData);
            
            clearInterval(progressInterval);
            setGenerationProgress(100);
            setTimeout(() => setIsSuccess(true), 500);
        } catch (error) {
            alert('Error generating estimate. Please try again.');
        } finally {
            setTimeout(() => setIsGenerating(false), 2000);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-luxury-gold animate-pulse font-bold">Initializing Luxury Estimator...</div>;

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Generation Overlay */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="max-w-md w-full"
                        >
                            <div className="relative mb-12">
                                <div className="w-32 h-32 border-4 border-luxury-gold/20 rounded-full mx-auto flex items-center justify-center">
                                    <Loader2 size={48} className="text-luxury-gold animate-spin" />
                                </div>
                                <motion.div 
                                    className="absolute inset-0 border-4 border-luxury-gold rounded-full"
                                    style={{ clipPath: `inset(${(100 - generationProgress)}% 0 0 0)` }}
                                />
                            </div>
                            
                            <h2 className="text-3xl font-serif font-bold text-white mb-4">Architecting Your Estimate</h2>
                            <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-8 animate-pulse">
                                {generationProgress < 40 ? 'Analyzing material market rates...' : 
                                 generationProgress < 80 ? 'Generating detailed luxury booklet...' : 
                                 'Finalizing professional proposal...'}
                            </p>
                            
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                    className="h-full bg-luxury-gold shadow-glow-gold"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${generationProgress}%` }}
                                />
                            </div>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Progress: {generationProgress}%</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-6 shadow-glow-gold"
                    >
                        <Sparkles size={14} /> Design Your Destiny
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Interior <span className="text-luxury-gold italic">Project Estimator</span></h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">Experience precision and luxury. Get a detailed professional estimate for your dream property in minutes.</p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="relative flex justify-between">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2" />
                        {[0, 1, 2, 3].map((s) => (
                            <div 
                                key={s} 
                                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                                    step >= s ? 'bg-luxury-gold text-white shadow-glow-gold scale-110' : 'bg-luxury-charcoal text-gray-500 border-2 border-white/10'
                                }`}
                            >
                                {step > s ? <CheckCircle2 size={24} /> : s + 1}
                                <span className={`absolute top-full mt-4 whitespace-nowrap text-[10px] uppercase font-bold tracking-widest ${step >= s ? 'text-luxury-gold' : 'text-gray-500'}`}>
                                    {s === 0 ? 'Design Style' : s === 1 ? 'Personal Details' : s === 2 ? 'Requirements' : 'Review & Quote'}
                                </span>
                            </div>
                        ))}
                        <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-luxury-gold transition-all duration-700 -translate-y-1/2" 
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div 
                                    key="step0"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-3xl font-serif font-bold text-white">Choose Your <span className="text-luxury-gold">Design Inspiration</span></h3>
                                        <p className="text-white/60 mt-2">Select a theme that aligns with your vision and budget.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {costs?.styleTiers?.map(tier => (
                                            <button
                                                key={tier.id}
                                                onClick={() => {
                                                    setClientInfo({...clientInfo, selectedStyleId: tier.id, budgetRange: tier.name});
                                                    setStep(1);
                                                }}
                                                className={`group relative h-[400px] rounded-3xl overflow-hidden border-2 transition-all ${
                                                    clientInfo.selectedStyleId === tier.id ? 'border-luxury-gold shadow-glow-gold' : 'border-white/10'
                                                }`}
                                            >
                                                <img src={tier.image} alt={tier.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                                                <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{tier.name}</h3>
                                                    <p className="text-luxury-gold font-bold uppercase tracking-widest text-[10px]">Starts from ₹{tier.pricePerSqFt}/sqft</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-luxury p-8 md:p-12 border border-white/10"
                                >
                                    <h3 className="text-2xl font-serif font-bold text-white mb-8 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold border border-luxury-gold/20">
                                            <User size={20} />
                                        </div>
                                        Client Profile
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input 
                                                    type="text"
                                                    value={clientInfo.name}
                                                    onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-luxury-gold transition-all text-white"
                                                    placeholder="e.g. John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input 
                                                    type="tel"
                                                    value={clientInfo.phone}
                                                    onChange={e => setClientInfo({...clientInfo, phone: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-luxury-gold transition-all text-white"
                                                    placeholder="+91 00000 00000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Property Type</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {PROPERTY_TYPES.map(type => (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setClientInfo({...clientInfo, propertyType: type.id})}
                                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                                            clientInfo.propertyType === type.id 
                                                            ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold shadow-glow-gold' 
                                                            : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <type.icon size={20} className="mb-2" />
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{type.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Total Area (Sq.ft)</label>
                                            <div className="relative">
                                                <Grid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input 
                                                    type="number"
                                                    value={clientInfo.totalArea}
                                                    onChange={e => setClientInfo({...clientInfo, totalArea: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-luxury-gold transition-all text-white"
                                                    placeholder="e.g. 1200"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input 
                                                    type="text"
                                                    value={clientInfo.location}
                                                    onChange={e => setClientInfo({...clientInfo, location: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-luxury-gold transition-all text-white"
                                                    placeholder="e.g. Mumbai, India"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Expected Completion</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {TIMELINES.map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setClientInfo({...clientInfo, timeline: t})}
                                                        className={`py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                            clientInfo.timeline === t 
                                                            ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold' 
                                                            : 'bg-white/5 border-white/10 text-gray-500'
                                                        }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button 
                                            onClick={() => setStep(0)}
                                            className="px-8 py-5 border border-luxury-gold text-luxury-gold rounded-2xl font-bold uppercase tracking-widest hover:bg-luxury-gold/5 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={() => setStep(2)}
                                            disabled={!clientInfo.name || !clientInfo.phone || !clientInfo.totalArea}
                                            className="px-12 py-5 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest shadow-glow-gold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-3"
                                        >
                                            Next Step <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    {CATEGORIES.map((category) => (
                                        <div key={category.id} className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-luxury p-8 border border-white/10 hover:border-luxury-gold/30 transition-all">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold border border-luxury-gold/20">
                                                    <category.icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-serif font-bold text-white">{category.label}</h4>
                                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Select your preference</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {category.options.map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleCategorySelect(category.id, option)}
                                                        className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                                            selections[category.id]?.material === option
                                                            ? 'bg-luxury-gold text-white border-luxury-gold shadow-glow-gold'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-luxury-gold/30 hover:text-white'
                                                        }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-between mt-12">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="px-8 py-5 border border-luxury-gold text-luxury-gold rounded-2xl font-bold uppercase tracking-widest hover:bg-luxury-gold/5 transition-all flex items-center gap-3"
                                        >
                                            <ChevronLeft size={20} /> Back
                                        </button>
                                        <button 
                                            onClick={() => setStep(3)}
                                            className="px-12 py-5 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest shadow-glow-gold hover:scale-105 transition-all flex items-center gap-3"
                                        >
                                            Review Summary <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-black/60 backdrop-blur-2xl rounded-3xl shadow-luxury p-10 border border-white/10 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                                    
                                    <h3 className="text-3xl font-serif font-bold text-white mb-10 relative flex items-center gap-4">
                                        <FileText className="text-luxury-gold" />
                                        Final Quotation Preview
                                    </h3>

                                    <div className="space-y-6 mb-12 relative">
                                        {CATEGORIES.filter(c => selections[c.id]).map(c => (
                                            <div key={c.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-luxury-gold/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-luxury-charcoal rounded-full flex items-center justify-center text-luxury-gold border border-white/10 shadow-sm group-hover:shadow-glow-gold/20 transition-all">
                                                        <c.icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{c.label}</p>
                                                        <p className="font-bold text-white">{selections[c.id].material}</p>
                                                    </div>
                                                </div>
                                                <p className="font-mono font-bold text-luxury-gold text-lg">₹{selections[c.id].cost.toLocaleString('en-IN')}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t-2 border-dashed border-white/10 pt-10 mb-12 relative">
                                        <div className="flex justify-between mb-4">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Project Subtotal</span>
                                            <span className="text-white font-mono font-bold text-xl">₹{totalCost.subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between mb-8">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">GST (18%)</span>
                                            <span className="text-white font-mono font-bold text-xl">₹{totalCost.gst.toLocaleString('en-IN')}</span>
                                        </div>
                                        
                                        <div className="p-8 bg-luxury-charcoal rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-luxury-gold/5 group-hover:bg-luxury-gold/10 transition-all" />
                                            <div className="text-center md:text-left relative z-10">
                                                <p className="text-luxury-gold uppercase font-bold tracking-[0.3em] text-[10px] mb-2">Grand Total Estimate</p>
                                                <p className="text-4xl md:text-5xl font-serif font-bold text-white">₹{totalCost.total.toLocaleString('en-IN')}</p>
                                            </div>
                                            <button 
                                                onClick={handleGeneratePDF}
                                                disabled={isGenerating}
                                                className="w-full md:w-auto px-10 py-5 bg-luxury-gold text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-gold flex items-center justify-center gap-3 relative z-10"
                                            >
                                                <Download size={20} /> Generate Luxury Booklet
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-start">
                                        <button 
                                            onClick={() => setStep(2)}
                                            className="text-[10px] font-bold text-gray-500 hover:text-luxury-gold uppercase tracking-[0.2em] transition-all"
                                        >
                                            &larr; Modify Requirements
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sticky Calculation Panel */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-luxury p-8 border border-white/10 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                                
                                <h4 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
                                    <Calculator size={18} className="text-luxury-gold" /> Live Estimate
                                </h4>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span className="font-bold uppercase tracking-widest">Base Area</span>
                                        <span className="text-white font-bold">{clientInfo.totalArea || 0} Sq.ft</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span className="font-bold uppercase tracking-widest">Selections</span>
                                        <span className="text-white font-bold">{Object.keys(selections).length} Categories</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span className="font-bold uppercase tracking-widest">Style</span>
                                        <span className="text-luxury-gold font-bold">{clientInfo.budgetRange || 'Default'}</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Current Subtotal</p>
                                    <p className="text-3xl font-serif font-bold text-luxury-gold">₹{totalCost.subtotal.toLocaleString('en-IN')}</p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-dashed border-white/10">
                                    <div className="flex items-center gap-4 p-4 bg-luxury-gold/10 rounded-2xl border border-luxury-gold/20 shadow-glow-gold/10">
                                        <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-white shrink-0 shadow-glow-gold">
                                            <Sparkles size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest">Smart Suggestion</p>
                                            <p className="text-xs text-gray-400 font-medium leading-tight mt-1">
                                                {clientInfo.selectedStyleId === 'ultra' 
                                                ? 'Your selections align with 5-star international standards.' 
                                                : 'Upgrade to Ultra-Luxury for premium imported finishes.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-luxury-charcoal rounded-3xl p-8 text-white border border-white/10">
                                <h5 className="font-serif font-bold text-luxury-gold text-lg mb-2">Need Expert Help?</h5>
                                <p className="text-xs text-gray-400 leading-relaxed mb-6">Our design consultants are available for a 1-on-1 virtual walkthrough of your project details.</p>
                                <a 
                                    href={`tel:9967044479`}
                                    className="block text-center py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                                >
                                    Call Now: 9967044479
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteriorEstimator;
