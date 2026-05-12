import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Construction, Search, SlidersHorizontal } from 'lucide-react';
import { ProjectCategory } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useCompanyData } from '../hooks/useCompanyData';
import SEO from '../components/SEO';
import ProjectCard3D from '../components/luxury/ProjectCard3D';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const Label = ({ children }: { children: string }) => (
  <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4 flex items-center gap-3" style={{ color: GOLD }}>
    <span className="w-8 h-[1px] inline-block" style={{ background: `linear-gradient(90deg,${GOLD},transparent)` }} />
    {children}
  </p>
);

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const { projects, loading } = useProjects();
  const { projectsMaintenance } = useCompanyData();

  const categories = ['All', ...Object.values(ProjectCategory)];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  if (projectsMaintenance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6" style={{ background: '#060606' }}>
        <div className="w-24 h-24 flex items-center justify-center mb-8 rounded-sm"
          style={{ border: '1px solid rgba(197,160,89,0.3)', background: 'rgba(197,160,89,0.05)' }}>
          <Construction className="w-10 h-10" style={{ color: GOLD }} />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond',serif" }}>Portfolio Under Update</h2>
        <p className="text-gray-500 max-w-md mb-10">We are documenting our newest masterpieces. Please check back soon.</p>
        <button onClick={() => navigate('/')}
          className="px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-bold"
          style={{ background: `linear-gradient(135deg,${GOLD},#b08d42)`, color: '#000', borderRadius: '2px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen overflow-x-hidden" style={{ background: '#060606' }}>
      <SEO
        title="Our Projects | Sonu Enterprises"
        description="Browse our luxury portfolio of interior design and construction projects."
        canonical="https://sonu-builders.in/projects"
      />

      {/* ── CINEMATIC HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 30%,rgba(197,160,89,0.06) 0%,transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(197,160,89,0.15),transparent)' }} />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}><Label>Our Portfolio</Label></motion.div>
            <motion.h1 variants={fadeUp}
              className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-none mb-6 text-glow-white"
              style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-0.03em' }}>
              Featured<br />
              <span style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Projects
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg max-w-xl">
              A curated showcase of spaces we've transformed — from luxury residences to premium commercial environments.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          {categories.map((cat) => {
            const isActive = filter === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="px-6 py-2 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all duration-300"
                style={{
                  border: isActive ? `1px solid ${GOLD}` : '1px solid rgba(255,255,255,0.07)',
                  background: isActive ? `linear-gradient(135deg,${GOLD},#b08d42)` : 'rgba(197,160,89,0.03)',
                  color: isActive ? '#000' : 'rgba(197,160,89,0.6)',
                  borderRadius: '2px',
                }}>
                {cat}
              </motion.button>
            );
          })}
          <div className="w-9 h-9 flex items-center justify-center ml-1"
            style={{ border: '1px solid rgba(197,160,89,0.15)', borderRadius: '2px', color: 'rgba(197,160,89,0.5)' }}>
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* ── PROJECT MASONRY GRID ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="break-inside-avoid h-64 animate-pulse rounded-sm"
                style={{ background: 'rgba(197,160,89,0.04)' }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((project, i) => (
                <ProjectCard3D
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  image={project.image}
                  category={project.category}
                  location={project.location}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div className="py-40 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Search className="w-12 h-12 mx-auto mb-6" style={{ color: 'rgba(197,160,89,0.2)' }} />
            <h3 className="text-2xl font-bold text-gray-600" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
              No projects found in this category
            </h3>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;
