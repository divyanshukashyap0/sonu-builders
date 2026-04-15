import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useCompanyData } from '../../hooks/useCompanyData';
import { motion } from 'framer-motion';

interface LeadCaptureFormProps {
    backgroundImage?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
    backgroundImage: defaultBg = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'
}) => {
    // Dynamic Content
    const { content } = useSiteContent('lead_capture', {
        title: 'Start Your Journey',
        subtitle: 'Consultation',
        description: 'We prioritize your privacy and trust. By submitting this form, you agree to our terms of service. We use your data solely to customize your design proposal and will never share it with third parties.',
        policyLink: '/privacy-policy',
        backgroundImage: defaultBg
    });

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
        const detectCity = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.city) {
                    setFormData(prev => ({ ...prev, city: data.city }));
                }
            } catch (error) {
                console.error("Geolocation failed:", error);
            }
        };
        detectCity();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'leads'), {
                ...formData,
                source: 'Web Lead Capture Form',
                status: 'New',
                createdAt: new Date(),
                budget: formData.budget || 'Not specified'
            });

            const form = document.createElement('form');
            form.action = `https://formsubmit.co/${encodeURIComponent(contactInfo.email)}`;
            form.method = 'POST';

            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                city: formData.city,
                propertyType: formData.propertyType,
                budget: formData.budget || 'Not specified',
                whatsappOptIn: formData.whatsappOptIn ? 'Yes' : 'No',
                source: 'Web Lead Capture Form'
            };

            for (const [key, value] of Object.entries(payload)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            }

            const subjectInput = document.createElement('input');
            subjectInput.type = 'hidden';
            subjectInput.name = '_subject';
            subjectInput.value = 'New Request from Lead Capture Form';
            form.appendChild(subjectInput);

            const nextInput = document.createElement('input');
            nextInput.type = 'hidden';
            nextInput.name = '_next';
            nextInput.value = `${window.location.origin}/?sent=1`;
            form.appendChild(nextInput);

            const captchaInput = document.createElement('input');
            captchaInput.type = 'hidden';
            captchaInput.name = '_captcha';
            captchaInput.value = 'false';
            form.appendChild(captchaInput);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);

            setFormData({
                name: '',
                phone: '',
                email: '',
                city: '',
                propertyType: '',
                whatsappOptIn: true
            });
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error(error);
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
        <section className="relative py-24 overflow-hidden border-t border-luxury-gold/5 bg-neutral-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={content.backgroundImage}
                    alt="Luxury Background"
                    className="w-full h-full object-cover opacity-20 filter blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content - Policies & Info */}
                    <div className="text-white relative z-10 space-y-8">
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
                                <span className="text-luxury-gold font-bold uppercase tracking-widest text-sm">
                                    {content.subtitle}
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6"
                            >
                                {content.title}
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-lg"
                            >
                                <h4 className="text-lg font-bold text-white mb-2">Private & Secure</h4>
                                <p className="text-neutral-400 leading-relaxed text-sm mb-4">
                                    {content.description}
                                </p>
                                {content.policyLink && (
                                    <a
                                        href={content.policyLink}
                                        className="inline-flex items-center text-luxury-gold hover:text-white text-sm md:text-xs font-bold uppercase tracking-widest transition-colors py-2"
                                    >
                                        Read Full Policy <ArrowRight className="w-4 h-4 md:w-3 md:h-3 ml-2" />
                                    </a>
                                )}
                            </motion.div>
                        </div>

                        <div className="flex gap-8 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-2xl font-serif font-bold text-white">24h</p>
                                <p className="text-sm md:text-xs text-neutral-500 uppercase tracking-widest mt-1">Response Time</p>
                            </div>
                            <div>
                                <p className="text-2xl font-serif font-bold text-white">100%</p>
                                <p className="text-sm md:text-xs text-neutral-500 uppercase tracking-widest mt-1">Confidential</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="bg-neutral-900/80 backdrop-blur-md rounded-2xl shadow-luxury-hover p-8 lg:p-10 border border-white/10 relative overflow-hidden"
                    >
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-luxury-gold/10 rounded-full blur-[80px] pointer-events-none" />

                        {isSuccess ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30"
                                >
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </motion.div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-4">
                                    Request Received
                                </h3>
                                <p className="text-neutral-400 text-lg">
                                    Our design team will prevent you shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                                <div>
                                    <label htmlFor="name" className="block text-sm md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-neutral-600 hover:bg-white/10 text-base"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
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
                                        className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-neutral-600 hover:bg-white/10 text-base"
                                        placeholder="10-digit mobile number"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-neutral-600 hover:bg-white/10 text-base"
                                        placeholder="your.email@example.com (Optional)"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all outline-none placeholder-neutral-600 hover:bg-white/10 text-base"
                                        placeholder="Your city"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="propertyType" className="block text-sm md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
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
                                            className={`w-full px-4 py-4 bg-white/5 border text-white rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all appearance-none outline-none hover:bg-white/10 text-base ${touched.propertyType && !formData.propertyType ? 'border-red-500' : 'border-white/10'
                                                }`}
                                        >
                                            <option value="" disabled className="bg-neutral-900">Select property type</option>
                                            <option value="Residential Interiors" className="bg-neutral-900">Residential Interiors</option>
                                            <option value="Commercial Spaces" className="bg-neutral-900">Commercial Spaces</option>
                                            <option value="Turnkey Architecture" className="bg-neutral-900">Turnkey Architecture</option>
                                            <option value="Other" className="bg-neutral-900">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="budget" className="block text-sm md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                        Estimated Budget
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="budget"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all appearance-none outline-none hover:bg-white/10 text-base"
                                        >
                                            <option value="" disabled className="bg-neutral-900">Select budget constraint</option>
                                            <option value="Under ₹5L" className="bg-neutral-900">Under ₹5 Lakhs</option>
                                            <option value="₹5L - ₹15L" className="bg-neutral-900">₹5L - ₹15 Lakhs</option>
                                            <option value="₹15L - ₹30L" className="bg-neutral-900">₹15L - ₹30 Lakhs</option>
                                            <option value="₹30L+" className="bg-neutral-900">Above ₹30 Lakhs</option>
                                            <option value="Not decided yet" className="bg-neutral-900">Not decided yet</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="whatsappOptIn"
                                        name="whatsappOptIn"
                                        checked={formData.whatsappOptIn}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 bg-neutral-800 text-luxury-gold focus:ring-luxury-gold border-white/20 rounded accent-luxury-gold"
                                    />
                                    <label htmlFor="whatsappOptIn" className="text-xs text-neutral-400 leading-relaxed">
                                        I agree to receive design updates and consultation calls via WhatsApp.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-luxury-gold to-[#B08D57] hover:to-luxury-gold text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg shadow-luxury-gold/20 hover:shadow-luxury-gold/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Get My Proposal
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LeadCaptureForm;
