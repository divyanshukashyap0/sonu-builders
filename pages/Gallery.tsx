import React, { useMemo, useState } from 'react';
import Section from '../components/Section';
import PageHero from '../components/luxury/PageHero';
import { useGallery } from '../hooks/useGallery';
import { usePageHeaders } from '../hooks/usePageHeaders';
import ImageGalleryModal from '../components/ImageGalleryModal';

const Gallery: React.FC = () => {
  const { items, loading } = useGallery();
  const { headers, loading: headersLoading } = usePageHeaders();
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

  if (loading || headersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4"></div>
          <p className="text-luxury-gold font-serif tracking-widest text-sm animate-pulse uppercase">Curating Inspiration</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title={headers.gallery.title}
        subtitle={headers.gallery.subtitle}
        backgroundImage="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80"
      />

      <Section className="!bg-stone-50 dark:!bg-luxury-obsidian">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 ${activeCategory === cat
                ? 'bg-luxury-gold text-white shadow-luxury transform scale-105'
                : 'bg-white dark:bg-luxury-charcoal text-luxury-charcoal dark:text-white hover:bg-luxury-gold hover:text-white border border-luxury-gold/20'
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
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/80 via-luxury-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 p-4 relative z-10 w-full">
          {item.category && (
            <span className="inline-block px-3 py-1 bg-luxury-gold text-white text-[10px] uppercase tracking-tighter font-bold rounded-sm mb-2">
              {item.category}
            </span>
          )}
          {item.title && <h4 className="text-lg font-bold text-white font-serif">{item.title}</h4>}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
