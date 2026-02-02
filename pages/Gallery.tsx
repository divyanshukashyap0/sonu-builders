import React, { useMemo, useState } from 'react';
import Section from '../components/Section';
import { useGallery } from '../hooks/useGallery';
import ImageGalleryModal from '../components/ImageGalleryModal';

const Gallery: React.FC = () => {
  const { items, loading } = useGallery();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

  const categories = useMemo(() => {
    const base = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Commercial'];
    const cats = Array.from(new Set(items.map(i => (i.category || '')))).filter(Boolean);
    const merged = Array.from(new Set([...base, ...cats]));
    return ['All', ...merged];
  }, [items]);

  const visible = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter(i => i.category === activeCategory);
  }, [items, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="bg-brand-dark text-white">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Gallery</h1>
          <p className="text-lg text-slate-300">
            Explore project highlights and behind-the-scenes moments.
          </p>
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-brand-blue text-white shadow-lg transform scale-105'
                  : 'bg-brand-blue/10 text-brand-dark hover:bg-brand-blue/20 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onOpen={() => { setModalImages([item.url]); setModalTitle(item.title); setModalOpen(true); }}
            />
          ))}
        </div>
      </Section>

      <ImageGalleryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={modalImages}
        title={modalTitle}
      />
    </div>
  );
};

const GalleryCard: React.FC<{ item: any; onOpen: () => void }> = ({ item, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-lg border border-transparent hover:border-brand-gold/40 cursor-pointer"
      onClick={onOpen}
    >
      <div className="aspect-w-4 aspect-h-3 relative">
        <div className={`absolute inset-0 bg-slate-200 animate-pulse ${loaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={item.url}
          alt={item.title || 'Gallery image'}
          className={`w-full h-64 object-cover transform transition-transform duration-500 ${loaded ? 'group-hover:scale-105' : 'scale-100'}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 p-4">
          {item.category && (
            <span className="inline-block px-3 py-1 bg-brand-gold text-white text-xs font-semibold rounded-full mb-2">
              {item.category}
            </span>
          )}
          {item.title && <h4 className="text-lg font-bold text-white">{item.title}</h4>}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
