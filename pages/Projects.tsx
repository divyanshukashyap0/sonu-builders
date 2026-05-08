import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, MapPin, Construction, 
  Search, SlidersHorizontal, ChevronRight
} from 'lucide-react';
import { ProjectCategory, Project } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useCompanyData } from '../hooks/useCompanyData';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import MediaRenderer from '../components/ui/MediaRenderer';
import { ProjectCardSkeleton } from '../components/Skeleton';
import Section from '../components/Section';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const { projects, loading: projectsLoading } = useProjects();
  const { projectsMaintenance } = useCompanyData();

  const categories = ['All', ...Object.values(ProjectCategory)];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  if (projectsMaintenance) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-8 border border-luxury-gold/20">
          <Construction className="w-10 h-10 text-luxury-gold" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Portfolio Under Update</h2>
        <p className="max-w-md text-gray-400 mb-8">We are documenting our newest masterpieces. Please check back soon.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-luxury-gold text-black rounded-xl font-bold">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      <SEO
        title="Our Projects"
        description="Browse our portfolio of luxury interiors and completed construction projects."
        canonical="https://sonu-builders.in/projects"
      />

      <div className="container-premium pt-24 md:pt-32">
        <Breadcrumbs />
        
        <div className="mt-8 mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Our Projects</h1>
          <p className="text-gray-400 text-lg max-w-xl">Crafting beautiful spaces that speak for themselves</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all border ${
                filter === cat
                  ? 'bg-luxury-gold text-black border-luxury-gold shadow-glow-gold'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-luxury-gold transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Project List */}
        <div className="space-y-8">
          {projectsLoading ? (
            [...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="group relative flex flex-col md:flex-row bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-luxury-gold/30 transition-all cursor-pointer"
                  >
                    {/* Image Area */}
                    <div className="w-full md:w-[45%] lg:w-[40%] aspect-[4/3] md:aspect-auto overflow-hidden">
                      <MediaRenderer 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]"
                      />
                      <div className="absolute top-6 right-6 md:right-auto md:left-6 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-luxury-gold">
                        {project.category}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-luxury-gold/80 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
                        <MapPin size={14} />
                        <span>{project.location}</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 group-hover:text-luxury-gold transition-colors">
                        {project.title}
                      </h2>
                      
                      <p className="text-gray-400 text-lg font-light line-clamp-2 mb-8 max-w-xl">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                          Explore Project <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform text-luxury-gold" />
                        </div>
                        
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-black transition-all">
                           <ArrowRight size={24} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {!projectsLoading && filteredProjects.length === 0 && (
          <div className="py-32 text-center">
            <Search className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-serif text-gray-500">No projects found in this category</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
