import React, { useState } from 'react';
import Section from '../components/Section';
import PageHero from '../components/luxury/PageHero';
import ProjectFilter from '../components/luxury/ProjectFilter';
import ImageGalleryModal from '../components/ImageGalleryModal';
import Button from '../components/Button';
import { ProjectCategory, Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { usePageHeaders } from '../hooks/usePageHeaders';
import SEO from '../components/SEO';
import { Maximize2, Camera, Construction, Hammer, Phone } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';

import { ProjectCardSkeleton } from '../components/Skeleton';
import MediaRenderer from '../components/ui/MediaRenderer';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { projects, loading: projectsLoading } = useProjects();
  const { headers, loading: headersLoading } = usePageHeaders();
  const { projectsMaintenance } = useCompanyData();

  const categories = ['All', ...Object.values(ProjectCategory)];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  const openGallery = (project: Project) => {
    setSelectedProject(project);
  };

  const closeGallery = () => {
    setSelectedProject(null);
  };

  // Helper to get all images for the selected project
  const getProjectImages = (project: Project | null) => {
    if (!project) return [];
    if (project.gallery && project.gallery.length > 0) {
      return project.gallery;
    }
    return [project.image];
  };

  // Pre-define dummy headers if loading
  const headerData = headersLoading || !headers?.projects ? {
    title: "Our Projects",
    subtitle: "Documenting our latest masterpieces",
    backgroundImage: ""
  } : headers.projects;

  if (projectsMaintenance) {
    return (
      <div className="min-h-screen bg-black">
        <PageHero
          title="Portfolio Refresh"
          subtitle="Our latest masterpieces are being documented"
          backgroundImage="https://images.unsplash.com/photo-1430263326118-b75ca0da770b?w=1600&q=80"
        />
        <Section className="flex flex-col items-center text-center py-32">
          <div className="w-24 h-24 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-8 border border-luxury-gold/20">
            <Construction className="w-12 h-12 text-luxury-gold animate-bounce" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6">Gallery Under Refinement</h2>
          <p className="max-w-2xl text-lg text-luxury-charcoal/70 dark:text-white/70 mb-12 leading-relaxed">
            We are currently updating our portfolio with our newest luxury residential and commercial projects. 
            Our digital showcase will return shortly with even more inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button to="/contact" variant="primary">Schedule a Site Visit</Button>
            <Button to="/gallery" variant="outline">View Design Inspiration</Button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="Our Projects"
        description="Browse our portfolio of luxury interiors and completed construction projects. See why 4000+ families trust us."
        canonical="https://sonu-builders.in/projects"
      />
      <PageHero
        title={headerData.title}
        subtitle={headerData.subtitle}
        backgroundImage={headerData.backgroundImage}
      />

      <Section className="relative overflow-visible">
        {/* Background Text */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden -z-10">
            <span className="absolute top-20 -left-10 text-[8rem] md:text-[14rem] font-serif font-black text-white/[0.02] leading-none tracking-tighter lowercase whitespace-nowrap opacity-50">
                projects
            </span>
        </div>

        {/* Decorative Image Layer (Image on top of images background) */}
        <div className="absolute top-40 right-0 w-[40%] aspect-square bg-luxury-gold/5 rounded-full blur-[120px] -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="relative">
                <span className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Portfolio</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-white relative">
                    Curated <br />
                    <span className="text-luxury-gold italic">Architectural</span> Works
                </h2>
            </div>
            
            {/* Filter */}
            <ProjectFilter
              categories={categories}
              activeCategory={filter}
              onSelectCategory={setFilter}
              counts={categories.reduce((acc, cat) => {
                acc[cat] = cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length;
                return acc;
              }, {} as Record<string, number>)}
            />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projectsLoading ? (
            [...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-luxury-gold/50 transition-all duration-700 cursor-pointer shadow-2xl"
                onClick={() => openGallery(project)}
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <MediaRenderer
                    src={project.image || ''}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[3000ms] ease-out opacity-70 group-hover:opacity-100"
                    loading={projectsLoading ? 'lazy' : 'eager'}
                  />

                  {/* Glassmorphism Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-[1px] w-8 bg-luxury-gold" />
                            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-bold">
                                {project.category}
                            </span>
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">{project.title}</h3>
                        
                        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center">
                                <span className="mr-2">📍</span> {project.location}
                            </p>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white">
                                <Maximize2 size={18} />
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Gallery Count Badge */}
                  {project.gallery && project.gallery.length > 1 && (
                    <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-xl text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center z-20">
                      <Camera className="w-3 h-3 mr-2 text-luxury-gold" />
                      {project.gallery.length} Photos
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>


        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No projects found in this category.
          </div>
        )}
      </Section>

      {/* Gallery Modal */}
      <ImageGalleryModal
        isOpen={!!selectedProject}
        onClose={closeGallery}
        images={getProjectImages(selectedProject)}
        title={selectedProject?.title}
      />
    </div>
  );
};

export default Projects;
