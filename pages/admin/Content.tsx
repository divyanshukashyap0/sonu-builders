import React, { useState } from 'react';
import { FileText, MessageSquare, Image, Plus, Trash2, Edit, Star, LayoutTemplate, PenTool, BarChart3, ImageIcon, Check } from 'lucide-react';
import AdminSectionEditor from '../../components/admin/AdminSectionEditor';
import ServiceManager from '../../components/admin/ServiceManager';
import ProjectManager from '../../components/admin/ProjectManager';

const Content: React.FC = () => {
    const [activeView, setActiveView] = useState<'testimonials' | 'gallery' | 'blog' | 'page-headers' | 'home-hero' | 'about-page' | 'philosophy' | 'lead-capture' | 'trust-metrics' | 'why-choose-us' | 'services' | 'projects' | 'legal' | null>(null);

    // Mock Data for demonstration
    const testimonials = [
        { id: 1, name: "Rajesh Kumar", text: "Exceptional service and build quality.", rating: 5 },
        { id: 2, name: "Priya Singh", text: "Love the new interior design!", rating: 4 },
        { id: 3, name: "Amit Patel", text: "Professional team, delivered on time.", rating: 5 },
    ];

    const renderTestimonials = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Testimonials</h3>
                <button className="bg-luxury-gold text-stone-950 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-950 font-bold transition-all cursor-pointer">
                    <Plus size={18} /> Add New
                </button>
            </div>
            <div className="space-y-4">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-luxury-gold/10 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-stone-900 dark:text-white">{t.name}</p>
                            <p className="text-sm text-stone-500 dark:text-gray-400">"{t.text}"</p>
                            <div className="flex text-yellow-500 mt-1">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full text-blue-600 dark:text-blue-400 cursor-pointer"><Edit size={18} /></button>
                            <button className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full text-red-650 dark:text-red-400 cursor-pointer"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                {activeView && (
                    <button
                        onClick={() => setActiveView(null)}
                        className="text-stone-500 hover:text-luxury-gold transition-colors cursor-pointer"
                    >
                        &larr; Back
                    </button>
                )}
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                        {activeView ? activeView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Content Management'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {activeView ? `Manage your ${activeView.replace('-', ' ')} content.` : 'Select a section to manage content.'}
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            {!activeView ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Home Hero Card */}
                    <div
                        onClick={() => setActiveView('home-hero')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <LayoutTemplate className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Home Hero</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Manage the main landing section, headlines, and background visuals.</p>
                    </div>

                    {/* Philosophy Section Card */}
                    <div
                        onClick={() => setActiveView('philosophy')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Star className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Philosophy</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Edit the 'Defining Modern Luxury' section content and imagery.</p>
                    </div>

                    {/* Lead Capture Form Card */}
                    <div
                        onClick={() => setActiveView('lead-capture')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <MessageSquare className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Lead Form</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Customize the contact form background and policy text.</p>
                    </div>

                    {/* Why Choose Us Card */}
                    <div
                        onClick={() => setActiveView('why-choose-us')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Check className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Why Choose Us</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Edit the 'Excellence in Every Detail' section.</p>
                    </div>

                    {/* Trust Metrics Card (Placeholder -> Active) */}
                    <div
                        onClick={() => setActiveView('trust-metrics')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <BarChart3 className="w-8 h-8 text-stone-400 dark:text-neutral-500 mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Trust Metrics</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Edit statistics and achievement numbers.</p>
                    </div>

                    {/* Gallery Card  */}
                    <div
                        onClick={() => setActiveView('gallery')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ImageIcon className="w-8 h-8 text-stone-400 dark:text-neutral-500 mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Gallery Header</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Edit the gallery page intro text.</p>
                    </div>

                    {/* Blog Card */}
                    <div
                        onClick={() => setActiveView('blog')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FileText className="w-8 h-8 text-stone-400 dark:text-neutral-500 mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Blog Header</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Edit the blog page intro text.</p>
                    </div>

                    {/* About Page Card */}
                    <div
                        onClick={() => setActiveView('about-page')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <PenTool className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">About Us Page</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Manage founder details, images, and About page content.</p>
                    </div>

                    {/* Page Headers Card */}
                    <div
                        onClick={() => setActiveView('page-headers')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <LayoutTemplate className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Global Page Headers</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Manage titles, subtitles, and background images for main pages.</p>
                    </div>

                    {/* Services Card */}
                    <div
                        onClick={() => setActiveView('services')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <PenTool className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Service Details</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Manage all service categories, features, tips, and galleries.</p>
                    </div>

                    {/* Projects Card */}
                    <div
                        onClick={() => setActiveView('projects')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <LayoutTemplate className="w-8 h-8 text-luxury-gold mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Project Portfolio</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Manage detailed project stories, metadata, and high-res galleries.</p>
                    </div>

                    {/* Legal Card */}
                    <div
                        onClick={() => setActiveView('legal')}
                        className="group relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm border border-stone-200 dark:border-white/5 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-luxury"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FileText className="w-8 h-8 text-stone-400 dark:text-neutral-500 mb-4" />
                        <h3 className="text-xl font-serif text-stone-900 dark:text-white mb-2">Legal Pages</h3>
                        <p className="text-sm text-stone-500 dark:text-neutral-400">Edit Terms and Conditions and Privacy Policy content.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-stone-200 dark:border-white/5 shadow-glass text-stone-900 dark:text-white">
                    {activeView === 'services' && <ServiceManager />}
                    {activeView === 'projects' && <ProjectManager />}

                    {activeView === 'home-hero' && (
                        <AdminSectionEditor
                            sectionId="home_hero"
                            title="Home Hero Section"
                            fields={[
                                { key: 'title', label: 'Main Title', type: 'text', placeholder: 'Where Luxury' },
                                { key: 'subtitle', label: 'Subtitle (Emphasis)', type: 'text', placeholder: 'Meets Your Vision' },
                                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short intro text...' },
                                { key: 'ctaText', label: 'Button Text', type: 'text', placeholder: 'Get a Consultation' },
                                { key: 'backgroundImage', label: 'Background Image URL', type: 'image' },
                                { key: 'backgroundVideo', label: 'Background YouTube URL (Optional)', type: 'text', placeholder: 'https://youtube.com/watch?v=...' }
                            ]}
                        />
                    )}

                    {activeView === 'philosophy' && (
                        <AdminSectionEditor
                            sectionId="philosophy_section"
                            title="Philosophy Section"
                            fields={[
                                { key: 'title', label: 'Title', type: 'text', placeholder: 'Defining Modern Luxury' },
                                { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Our Vision' },
                                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mission statement...' },
                                { key: 'yearsExperience', label: 'Years Experience', type: 'text', placeholder: '15+' },
                                { key: 'imageUrl', label: 'Side Image URL', type: 'image' },
                                { key: 'videoUrl', label: 'Feature Video URL (YouTube)', type: 'text', placeholder: 'https://youtube.com/watch?v=...' }
                            ]}
                        />
                    )}

                    {activeView === 'lead-capture' && (
                        <AdminSectionEditor
                            sectionId="lead_capture"
                            title="Lead Capture Form"
                            fields={[
                                { key: 'title', label: 'Form Title', type: 'text', placeholder: 'Start Your Journey' },
                                { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Consultation' },
                                { key: 'description', label: 'Side Text / Policy', type: 'textarea', placeholder: 'We value your privacy...' },
                                { key: 'backgroundImage', label: 'Background Image URL', type: 'image' },
                                { key: 'policyLink', label: 'Policy Link URL', type: 'text', placeholder: '/privacy-policy' }
                            ]}
                        />
                    )}

                    {activeView === 'trust-metrics' && (
                        <AdminSectionEditor
                            sectionId="trust_metrics"
                            title="Trust Metrics"
                            fields={[
                                { key: 'stat1', label: 'Stat 1 (e.g., 4500+)', type: 'text' },
                                { key: 'label1', label: 'Label 1', type: 'text' },
                                { key: 'stat2', label: 'Stat 2', type: 'text' },
                                { key: 'label2', label: 'Label 2', type: 'text' },
                                { key: 'stat3', label: 'Stat 3', type: 'text' },
                                { key: 'label3', label: 'Label 3', type: 'text' },
                                { key: 'stat4', label: 'Stat 4', type: 'text' },
                                { key: 'label4', label: 'Label 4', type: 'text' }
                            ]}
                        />
                    )}

                    {activeView === 'why-choose-us' && (
                        <AdminSectionEditor
                            sectionId="why_choose_us"
                            title="Why Choose Us Section"
                            fields={[
                                { key: 'title', label: 'Title', type: 'text', placeholder: 'Excellence in Every Detail' },
                                { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Why Choose Us' },
                                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'We don\'t just design interiors...' },
                                { key: 'image', label: 'Main Image URL', type: 'image' }
                            ]}
                        />
                    )}



                    {activeView === 'gallery' && (
                        <AdminSectionEditor
                            sectionId="gallery_section"
                            title="Gallery Page Header"
                            fields={[
                                { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Our Portfolio' },
                                { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Curated Excellence' },
                                { key: 'description', label: 'Intro Text', type: 'textarea' },
                                { key: 'backgroundImage', label: 'Header Background', type: 'image' }
                            ]}
                        />
                    )}

                    {activeView === 'blog' && (
                        <AdminSectionEditor
                            sectionId="blog_section"
                            title="Blog Page Header"
                            fields={[
                                { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Design Insights' },
                                { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Trends & Tips' },
                                { key: 'description', label: 'Intro Text', type: 'textarea' },
                                { key: 'backgroundImage', label: 'Header Background', type: 'image' }
                            ]}
                        />
                    )}

                    {activeView === 'about-page' && (
                        <AdminSectionEditor
                            sectionId="about"
                            title="About Us Page"
                            fields={[
                                { key: 'headerTitle', label: 'Header Title', type: 'text' },
                                { key: 'headerSubtitle', label: 'Header Subtitle', type: 'textarea' },
                                { key: 'headerImage', label: 'Header Background', type: 'image' },
                                { key: 'mainTitle', label: 'Main Content Title', type: 'text' },
                                { key: 'founderName', label: 'Founder Name', type: 'text' },
                                { key: 'founderTitle', label: 'Founder Job Title', type: 'text' },
                                { key: 'founderBio', label: 'Founder Bio', type: 'textarea' },
                                { key: 'founderImage', label: 'Founder Image URL', type: 'image' }
                            ]}
                        />
                    )}

                    {activeView === 'page-headers' && (
                        <div className="space-y-8">
                            <AdminSectionEditor
                                sectionId="page_headers"
                                title="Services Page Header"
                                fields={[
                                    { key: 'services.title', label: 'Title', type: 'text' },
                                    { key: 'services.subtitle', label: 'Subtitle', type: 'textarea' },
                                    { key: 'services.backgroundImage', label: 'Background Image', type: 'image' }
                                ]}
                            />
                            <AdminSectionEditor
                                sectionId="page_headers"
                                title="Projects Page Header"
                                fields={[
                                    { key: 'projects.title', label: 'Title', type: 'text' },
                                    { key: 'projects.subtitle', label: 'Subtitle', type: 'textarea' },
                                    { key: 'projects.backgroundImage', label: 'Background Image', type: 'image' }
                                ]}
                            />
                            <AdminSectionEditor
                                sectionId="page_headers"
                                title="Gallery Page Header"
                                fields={[
                                    { key: 'gallery.title', label: 'Title', type: 'text' },
                                    { key: 'gallery.subtitle', label: 'Subtitle', type: 'textarea' },
                                    { key: 'gallery.backgroundImage', label: 'Background Image', type: 'image' }
                                ]}
                            />
                            <AdminSectionEditor
                                sectionId="page_headers"
                                title="Contact Page Header"
                                fields={[
                                    { key: 'contact.title', label: 'Title', type: 'text' },
                                    { key: 'contact.subtitle', label: 'Subtitle', type: 'textarea' },
                                    { key: 'contact.backgroundImage', label: 'Background Image', type: 'image' }
                                ]}
                            />
                        </div>
                    )}

                    {activeView === 'legal' && (
                        <AdminSectionEditor
                            sectionId="legal"
                            title="Legal Pages Content"
                            fields={[
                                { key: 'termsContent', label: 'Terms and Conditions Content (Use double newlines for paragraphs)', type: 'textarea' },
                            ]}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Content;
