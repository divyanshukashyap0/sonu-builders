import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  colored?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, className = '', id, colored = false }) => {
  const bgClass = colored ? 'bg-brand-gold/10' : 'bg-brand-blue/10';
  return (
    <section id={id} className={`py-16 md:py-24 ${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
