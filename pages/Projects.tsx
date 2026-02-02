import React, { useState } from 'react';
import Section from '../components/Section';
import ImageGalleryModal from '../components/ImageGalleryModal';
import { ProjectCategory, Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { Maximize2, Camera } from 'lucide-react';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { projects, loading } = useProjects();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="bg-brand-dark text-white">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Projects</h1>
          <p className="text-lg text-slate-300">
            A showcase of our commitment to excellence, innovation, and quality in every structure we build.
          </p>
        </div>
      </Section>

      <Section>
        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === category
                ? 'bg-brand-blue text-white shadow-lg transform scale-105'
                : 'bg-brand-blue/10 text-brand-dark hover:bg-brand-blue/20 border border-transparent'
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
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-brand-gold/40"
              onClick={() => openGallery(project)}
            >
              <div className="relative overflow-hidden aspect-w-4 aspect-h-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
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
                  <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors">{project.title}</h3>
                  <span className="inline-block px-2 py-1 bg-brand-light text-brand-blue text-xs font-semibold rounded-full">
                    {project.category}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-4 flex items-center">
                  <span className="text-brand-gold mr-1">📍</span> {project.location}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="text-xs text-brand-blue font-semibold border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span>{project.completionDate ? `Completed: ${project.completionDate}` : 'Ongoing'}</span>
                  <span className="text-brand-gold font-bold text-xs uppercase tracking-wider">View Details</span>
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
