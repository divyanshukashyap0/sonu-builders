import React, { useEffect, useRef } from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  colored?: boolean;
  reveal?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, className = '', id, colored = false, reveal = false }) => {
  const bgClass = colored ? '!bg-premium-stone' : '!bg-ivory-pearl';
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!reveal || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) el.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reveal]);

  return (
    <section ref={ref} id={id} className={`py-[var(--section-spacing-mobile)] md:py-[var(--section-spacing)] ${bgClass} ${className} ${reveal ? 'reveal' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
