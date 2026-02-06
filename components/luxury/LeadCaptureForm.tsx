import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface LeadCaptureFormProps {
    backgroundImage?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
    backgroundImage = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        propertyType: '',
        whatsappOptIn: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({
                    name: '',
                    phone: '',
                    city: '',
                    propertyType: '',
                    whatsappOptIn: true
                });
            }, 3000);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <section className="relative bg-stone-50 py-24 overflow-hidden border-t border-luxury-gold/5">
            {/* Background Image with Light Overlay */}
            <div className="absolute inset-0">
                <img
                    src={backgroundImage}
                    alt="Interior design"
                    className="w-full h-full object-cover opacity-[0.03] grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/95 to-stone-50/90" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div className="text-luxury-charcoal relative z-10">
                        <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] mb-3 text-xs">
                            Get Started
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
                            Let's Build Something{' '}
                            <span className="text-luxury-gold">Exceptional Together</span>
                        </h2>
                        <p className="text-luxury-charcoal/70 text-lg leading-relaxed mb-10 font-medium">
                            Share your vision with us. Our design experts will create a personalized proposal tailored to your style, budget, and timeline.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-5 h-5 text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-luxury-charcoal mb-1">Free Consultation</h4>
                                    <p className="text-luxury-charcoal/60 text-sm font-medium">No obligation. Just expert advice.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-5 h-5 text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-luxury-charcoal mb-1">Quick Response</h4>
                                    <p className="text-luxury-charcoal/60 text-sm font-medium">We'll get back to you within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-5 h-5 text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-luxury-charcoal mb-1">Personalized Proposal</h4>
                                    <p className="text-luxury-charcoal/60 text-sm font-medium">Customized design & pricing just for you.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="bg-white rounded-2xl shadow-luxury-hover p-8 lg:p-10">
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-2">
                                    Thank You!
                                </h3>
                                <p className="text-luxury-charcoal/60 font-medium">
                                    We've received your request. Our team will contact you shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold transition-all"
                                        placeholder="+91 "
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold transition-all"
                                        placeholder="Your city"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="propertyType" className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                        Property Type *
                                    </label>
                                    <select
                                        id="propertyType"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold transition-all"
                                    >
                                        <option value="">Select property type</option>
                                        <option value="apartment">Apartment / Flat</option>
                                        <option value="villa">Villa / Independent House</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="office">Office</option>
                                        <option value="commercial">Commercial Space</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="whatsappOptIn"
                                        name="whatsappOptIn"
                                        checked={formData.whatsappOptIn}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 text-luxury-gold focus:ring-luxury-gold border-gray-300 rounded"
                                    />
                                    <label htmlFor="whatsappOptIn" className="text-sm text-gray-600">
                                        Send me updates and design inspiration via WhatsApp
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Get Free Design Proposal
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    We respect your privacy. Your information is secure and will never be shared.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeadCaptureForm;
