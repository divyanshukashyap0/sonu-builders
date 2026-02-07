import React, { useState } from 'react';
import Section from '../components/Section';
import ImageGalleryModal from '../components/ImageGalleryModal';
import { ProjectCategory, Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { usePageHeaders } from '../hooks/usePageHeaders';
import { Maximize2, Camera } from 'lucide-react';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { projects, loading } = useProjects();
  const { headers, loading: headersLoading } = usePageHeaders();

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

  if (loading || headersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4"></div>
          <p className="text-luxury-gold font-serif tracking-widest text-sm animate-pulse uppercase">Refining Excellence</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-luxury-white dark:bg-luxury-charcoal pt-32 pb-20 text-center relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 via-luxury-gold/2 to-transparent z-0" /> */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal dark:text-white mb-4 animate-fadeInUp">
            {headers.projects.title}
          </h1>
          <p className="text-luxury-charcoal/70 dark:text-white/70 text-lg max-w-2xl mx-auto animate-fadeInUp font-medium" style={{ animationDelay: '0.2s' }}>
            {headers.projects.subtitle}
          </p>
        </div>
      </div>

      <Section>
        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 ${filter === category
                ? 'bg-luxury-gold text-white shadow-luxury transform scale-105'
                : 'bg-white dark:bg-luxury-charcoal text-luxury-charcoal dark:text-white hover:bg-luxury-gold hover:text-white border border-luxury-gold/20'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-luxury-charcoal rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-brand-gold/40"
              onClick={() => openGallery(project)}
            >
              <div className="relative overflow-hidden aspect-w-4 aspect-h-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
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
          ))}
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
