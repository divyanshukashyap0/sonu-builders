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
      <div className="min-h-screen bg-luxury-white dark:bg-luxury-charcoal">
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

      <Section>
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsLoading ? (
            [...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-luxury-charcoal rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-brand-gold/40"
                onClick={() => openGallery(project)}
              >
                <div className="relative overflow-hidden aspect-w-4 aspect-h-3 bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <MediaRenderer
                    src={project.image || ''}
                    alt={project.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                    loading={projectsLoading ? 'lazy' : 'eager'}
                    showPlayIcon
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Gallery Count */}
                  {project.gallery && project.gallery.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center z-20">
                      <Camera className="w-3 h-3 mr-1" />
                      {project.gallery.length} Photos
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">{project.title}</h3>
                    <span className="inline-block px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-[10px] uppercase tracking-tighter font-bold rounded-sm">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-3 flex items-center">
                    <span className="text-luxury-gold mr-1.5 opacity-60">📍</span> {project.location}
                  </p>
                  <p className="text-luxury-charcoal/70 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                    {project.description}
                  </p>

                  <div className="text-[10px] text-luxury-gold/60 font-bold uppercase tracking-widest border-t border-luxury-gold/10 pt-4 flex justify-between items-center">
                    <span>{project.completionDate ? `Completed: ${project.completionDate}` : 'Ongoing'}</span>
                    <span className="text-luxury-gold font-bold transition-colors group-hover:text-luxury-charcoal">View Details</span>
                  </div>
                </div>
              </div>
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
