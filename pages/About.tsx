import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Award, ShieldCheck, 
  Target, Eye, Heart, Compass, Clock, Gem,
  ArrowRight, Phone, MessageCircle
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import SEO from '../components/SEO';

const About: React.FC = () => {
  const { phone, name } = useCompanyData();

  const whatsappMessage = encodeURIComponent("Hi Sonu Enterprises, I'd like to learn more about your services.");
  const whatsappUrl = `https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const values = [
    {
      icon: <Gem className="w-6 h-6" />,
      title: "Quality",
      description: "We use the finest materials and deliver uncompromised quality."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Client First",
      description: "Your satisfaction is our top priority at every step."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Innovation",
      description: "We bring creative ideas and modern solutions to every space."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Transparency",
      description: "Honest communication and clear processes we believe in."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "On-Time Delivery",
      description: "We respect your time and deliver projects as promised."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Excellence",
      description: "We strive for perfection in design, execution & finishing."
    }
  ];

  const stats = [
    { label: "Projects Completed", value: "4500+", icon: <Building2 className="w-6 h-6" /> },
    { label: "Happy Families", value: "4000+", icon: <Users className="w-6 h-6" /> },
    { label: "Years Experience", value: "15+", icon: <Award className="w-6 h-6" /> },
    { label: "Quality Assurance", value: "Premium", icon: <ShieldCheck className="w-6 h-6" /> }
  ];

  return (
    <div className="bg-[#111] text-white min-h-screen font-sans overflow-hidden">
      <SEO
        title="About Us | Sonu Enterprises"
        description="Learn about Sonu Enterprises & Building Developers - our 15-year legacy of creating luxury interiors and building dream homes in Kalyan, Maharashtra."
        canonical="https://sonu-builders.in/about"
      />

      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 scale-110" 
            alt="About Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-[#c5a059] text-xs tracking-[0.3em] uppercase font-bold mb-4">ABOUT US</p>
            <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Designing Spaces.<br />
              Creating <span className="text-[#c5a059] italic">Lifestyles.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 max-w-xl leading-relaxed">
              At Sonu Enterprises, we believe that every space has the potential to inspire. We blend creativity, functionality, and craftsmanship to create interiors that are timeless and uniquely yours.
            </p>
            <Link to="/projects" className="inline-flex items-center border border-[#c5a059] text-[#c5a059] px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-[#c5a059] hover:text-black transition-all duration-300">
              Our Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-24 bg-[#0d0d0d] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.3em] uppercase mb-3">WHO WE ARE</p>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">
                Passion. Precision.<br />
                <span className="text-[#c5a059]">Perfection.</span>
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed text-sm">
                <p>
                  <strong className="text-white">SONU ENTERPRISES</strong> is a leading interior construction and design company based in Kalyan, Maharashtra. With over 15 years of experience, we have transformed 4500+ spaces across residential and commercial projects.
                </p>
                <p>
                  Our mission is simple — to deliver luxury interiors that reflect your personality and enhance the way you live. Every project we undertake is handled with meticulous attention to detail and a commitment to excellence.
                </p>
              </div>
              <div className="mt-12 pt-10 border-t border-white/5">
                <div className="font-serif italic text-2xl text-[#c5a059]">Sonu Enterprises</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-bold">Founder</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-sm hover:border-[#c5a059]/30 transition-colors">
                  <div className="text-[#c5a059] mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Our Story Section */}
      <section className="py-24 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.3em] uppercase mb-3">OUR STORY</p>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                From a Vision to<br />
                <span className="text-[#c5a059] italic text-4xl">Timeless</span> Designs
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed text-sm">
                <p>
                  What started as a small passion for design has now grown into a trusted brand known for quality, transparency, and exceptional execution. Every project we undertake is a promise of our dedication towards perfection.
                </p>
                <p>
                  We don't just design interiors, we craft experiences. Our team of expert designers and craftsmen work in harmony to bring your vision to life, ensuring that every corner of your home resonates with luxury and comfort.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/5] rounded-sm overflow-hidden border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000" 
                  className="w-full h-full object-cover" 
                  alt="Our Story" 
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-[#c5a059] text-black p-8 rounded-sm shadow-2xl hidden md:block">
                <div className="text-3xl font-bold leading-none">15+</div>
                <div className="text-[10px] uppercase tracking-widest font-bold mt-1">Years of<br />Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Our Values Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#c5a059] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">OUR VALUES</p>
            <div className="w-12 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 border border-white/5 hover:border-[#c5a059]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#c5a059] group-hover:text-black transition-all duration-500 text-[#c5a059]">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-wide">{value.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[250px] mx-auto">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-24 bg-[#111] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Let's Create Something<br />
            <span className="text-[#c5a059]">Beautiful Together.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            Your dream space is just one step away. Connect with our luxury design consultants today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link to="/contact" className="bg-[#c5a059] text-black px-12 py-4 rounded-sm text-sm uppercase tracking-widest font-bold hover:bg-[#b08d4a] transition-colors text-center">
              Contact Us
            </Link>
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-12 py-4 rounded-sm text-sm uppercase tracking-widest font-bold hover:border-[#c5a059] hover:text-[#c5a059] transition-colors text-center flex items-center justify-center gap-2"
            >
              WhatsApp Us <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
