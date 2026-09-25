import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useCompanyData } from '../../hooks/useCompanyData';
import { motion } from 'framer-motion';

interface LeadCaptureFormProps {
    backgroundImage?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    className?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
    backgroundImage: defaultBg = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    title: propTitle,
    subtitle: propSubtitle,
    description: propDescription,
    className = ''
}) => {
    // Dynamic Content
    const { content } = useSiteContent('lead_capture', {
        title: 'Start Your Journey',
        subtitle: 'Consultation',
        description: 'We prioritize your privacy and trust. By submitting this form, you agree to our terms of service. We use your data solely to customize your design proposal and will never share it with third parties.',
        policyLink: '/privacy-policy',
        backgroundImage: defaultBg
    });

    const displayTitle = propTitle || content.title;
    const displaySubtitle = propSubtitle || content.subtitle;
    const displayDescription = propDescription || content.description;

    const { contactInfo } = useCompanyData();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        propertyType: '',
        budget: '',
        whatsappOptIn: false
    });

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const cachedCity = localStorage.getItem('sonu_user_city');
                if (cachedCity) {
                    setFormData(prev => ({ ...prev, city: cachedCity }));
                    return;
                }
                const response = await fetch('https://ipapi.co/json/').catch(() => null);
                if (response && response.ok) {
                    const data = await response.json();
                    if (data.city) {
                        setFormData(prev => ({ ...prev, city: data.city }));
                        localStorage.setItem('sonu_user_city', data.city);
                    }
                }
            } catch (error) {
                // Silent fallback
                setFormData(prev => ({ ...prev, city: 'Mumbai' }));
            }
        };
        fetchGeoData();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [honeypot, setHoneypot] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (honeypot) {
            console.warn('Spam filtered via honeypot.');
            setIsSuccess(true);
            setFormData({
                name: '',
                phone: '',
                email: '',
                city: '',
                propertyType: '',
                budget: '',
                whatsappOptIn: true
            });
            return;
        }
        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || 'Not specified',
                city: formData.city,
                propertyType: formData.propertyType,
                budget: formData.budget || 'Not specified',
                whatsappOptIn: formData.whatsappOptIn ? 'Yes' : 'No',
                source: 'Web Lead Capture Form',
                _subject: 'New Request from Lead Capture Form',
                _captcha: 'false'
            };

            // 1. Save lead to Firestore
            await addDoc(collection(db, 'leads'), {
                ...formData,
                source: 'Web Lead Capture Form',
                status: 'New',
                createdAt: new Date(),
                budget: formData.budget || 'Not specified'
            });

            // 2. Post lead to FormSubmit AJAX
            const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactInfo.email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('FormSubmit AJAX post failed');
            }

            setIsSuccess(true);
            setFormData({
                name: '',
                phone: '',
                email: '',
                city: '',
                propertyType: '',
                budget: '',
                whatsappOptIn: true
            });
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    return (
        <section className={`relative py-16 md:py-24 overflow-hidden border-t border-luxury-gold/15 bg-transparent ${className}`}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src={content.backgroundImage}
                    alt="Luxury Background"
                    className="w-full h-full object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/95 to-[#FAF8F5]/80" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left Content - Policies & Info (5 cols) */}
                    <div className="lg:col-span-5 text-stone-900 relative z-10 space-y-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-3 mb-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30">
                                    <ShieldCheck className="w-5 h-5 text-luxury-gold" />
                                </div>
                                <span className="text-luxury-gold font-bold uppercase tracking-widest text-xs">
                                    {displaySubtitle}
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171717] leading-tight mb-5"
                            >
                                {displayTitle}
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-sm"
                            >
                                <h4 className="text-base font-bold text-[#171717] mb-2">Private & Confidential</h4>
                                <p className="text-stone-600 leading-relaxed text-sm mb-4">
                                    {displayDescription}
                                </p>
                                {content.policyLink && (
                                    <a
                                        href={content.policyLink}
                                        className="inline-flex items-center text-luxury-gold hover:text-stone-900 text-xs font-bold uppercase tracking-widest transition-colors py-1"
                                    >
                                        Read Full Policy <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                    </a>
                                )}
                            </motion.div>
                        </div>

                        <div className="flex gap-8 border-t border-stone-200/80 pt-6">
                            <div>
                                <p className="text-2xl font-serif font-bold text-[#171717]">24h</p>
                                <p className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">Response Time</p>
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold text-[#171717]">100%</p>
                                <p className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">Confidential</p>
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold text-[#171717]">Free</p>
                                <p className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">First Site Visit</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form - Spacious 7-col Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-2xl shadow-luxury-hover p-6 sm:p-8 lg:p-10 border border-luxury-gold/25 relative overflow-hidden"
                    >
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-luxury-gold/10 rounded-full blur-[80px] pointer-events-none" />

                        {isSuccess ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30"
                                >
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </motion.div>
                                <h3 className="text-3xl font-serif font-bold text-[#171717] mb-4">
                                    Request Received
                                </h3>
                                <p className="text-stone-600 text-base">
                                    Our senior design team will reach out to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative z-10" noValidate>
                                {/* Honeypot field for bot spam protection */}
                                <div style={{ display: 'none', opacity: 0, position: 'absolute', zIndex: -1 }} aria-hidden="true">
                                    <input
                                        type="text"
                                        name="website_verify"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-stone-300 text-stone-900 rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-stone-400 hover:bg-white text-sm"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            pattern="[0-9]{10}"
                                            className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-stone-300 text-stone-900 rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-stone-400 hover:bg-white text-sm"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-stone-300 text-stone-900 rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-stone-400 hover:bg-white text-sm"
                                            placeholder="your.email@example.com (Optional)"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label htmlFor="city" className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                            City / Locality *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            list="cities-lead-list"
                                            className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-stone-300 text-stone-900 rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-stone-400 hover:bg-white text-sm"
                                            placeholder="e.g. Mumbai, Thane, Kalyan"
                                        />
                                        <datalist id="cities-lead-list">
                                            <option value="Kalyan" />
                                            <option value="Dombivli" />
                                            <option value="Thane West" />
                                            <option value="Navi Mumbai" />
                                            <option value="Palava City" />
                                            <option value="Panvel" />
                                            <option value="Mumbai" />
                                        </datalist>
                                    </div>

                                    {/* Project Type */}
                                    <div>
                                        <label htmlFor="propertyType" className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                            Project Type *
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="propertyType"
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                className={`w-full px-4 py-3.5 bg-[#FAF8F5] border text-stone-900 rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none hover:bg-white text-sm cursor-pointer ${touched.propertyType && !formData.propertyType ? 'border-red-500' : 'border-stone-300'
                                                    }`}
                                            >
                                                <option value="" disabled className="bg-white text-stone-700">Select project type</option>
                                                <option value="Residential Interiors" className="bg-white text-stone-800">Residential Interiors</option>
                                                <option value="Commercial Spaces" className="bg-white text-stone-800">Commercial Spaces</option>
                                                <option value="Turnkey Architecture" className="bg-white text-stone-800">Turnkey Architecture</option>
                                                <option value="Renovation & Remodeling" className="bg-white text-stone-800">Renovation & Remodeling</option>
                                                <option value="Other" className="bg-white text-stone-800">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div>
                                        <label htmlFor="budget" className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                                            Estimated Budget
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="budget"
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-stone-300 text-stone-900 rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none hover:bg-white text-sm cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-white text-stone-700">Select budget range</option>
                                                <option value="Under ₹5L" className="bg-white text-stone-800">Under ₹5 Lakhs</option>
                                                <option value="₹5L - ₹15L" className="bg-white text-stone-800">₹5L - ₹15 Lakhs</option>
                                                <option value="₹15L - ₹30L" className="bg-white text-stone-800">₹15L - ₹30 Lakhs</option>
                                                <option value="₹30L+" className="bg-white text-stone-800">Above ₹30 Lakhs</option>
                                                <option value="Not decided yet" className="bg-white text-stone-800">Not decided yet</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* WhatsApp Opt-in (Full Width across both cols) */}
                                    <div className="sm:col-span-2 flex items-center gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                                        <input
                                            type="checkbox"
                                            id="whatsappOptIn"
                                            name="whatsappOptIn"
                                            checked={formData.whatsappOptIn}
                                            onChange={handleChange}
                                            className="w-4 h-4 flex-shrink-0 bg-white text-luxury-gold focus:ring-luxury-gold border-stone-300 rounded accent-luxury-gold cursor-pointer"
                                        />
                                        <label htmlFor="whatsappOptIn" className="text-xs text-stone-600 leading-snug cursor-pointer select-none">
                                            I agree to receive design updates and consultation calls via WhatsApp.
                                        </label>
                                    </div>

                                    {/* Submit CTA button (Full Width) */}
                                    <div className="sm:col-span-2 pt-1">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-luxury-gold to-[#B08D57] hover:to-luxury-gold text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-luxury-gold/20 hover:shadow-luxury-gold/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    Get My Proposal
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LeadCaptureForm;
