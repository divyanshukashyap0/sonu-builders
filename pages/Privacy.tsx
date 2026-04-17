import React from 'react';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { useCompanyData } from '../hooks/useCompanyData';

const Privacy: React.FC = () => {
  const { name, contactInfo } = useCompanyData();

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <SEO 
        title={`Privacy Policy | ${name}`} 
        description={`Learn how ${name} handles and protects your personal data.`}
      />
      <div className="pt-24 min-h-screen bg-neutral-950">
        <Section className="py-20 text-white">
          <div className="max-w-4xl mx-auto bg-neutral-900 border border-white/5 p-10 md:p-16 shadow-luxury rounded-sm">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-12 italic border-l-2 border-luxury-gold pl-4">Last Updated: {lastUpdated}</p>
            
            <div className="space-y-12 text-white/80 leading-relaxed font-medium">
              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">1. Introduction</h2>
                <p>
                  At <strong>{name}</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us through our website and services. By using our platform, you agree to the practices described in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">2. Information We Collect</h2>
                <p className="mb-4">We may collect information from you in several ways, including:</p>
                <ul className="list-disc ml-6 space-y-3 text-white/70 text-sm">
                  <li><strong className="text-white">Personal Information:</strong> Name, email address, phone number, and physical address provided during project inquiries or contact form submissions.</li>
                  <li><strong className="text-white">Project Details:</strong> Information regarding your construction or design preferences shared for estimation purposes.</li>
                  <li><strong className="text-white">Usage Data:</strong> Information about how you use our website, including your IP address, browser type, pages visited, and time spent on our site.</li>
                  <li><strong className="text-white">Cookies:</strong> Small data files stored on your device to enhance your browsing experience and analyze site traffic.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">3. How We Use Your Information</h2>
                <p>The information we collect is used to provide, maintain, and improve our services, including:</p>
                <ul className="list-disc ml-6 mt-3 space-y-3 text-white/70 text-sm">
                  <li>Processing your requests for project estimates and consultations.</li>
                  <li>Communicating with you regarding project updates, newsletters, or marketing (with your consent).</li>
                  <li>Improving our website performance and user experience.</li>
                  <li>Complying with legal obligations and protecting our rights.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">4. Data Protection & Security</h2>
                <p>
                  We implement a range of security measures to maintain the safety of your personal information. This includes encrypted storage, secure servers, and restricted access to data by authorized personnel only. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">5. Sharing of Information</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-3 text-white/70 text-sm">
                  <li><strong className="text-white">Service Providers:</strong> Trusted third parties who assist us in operating our website or conducting our business.</li>
                  <li><strong className="text-white">Legal Compliance:</strong> When required by law or to protect our rights, property, or safety.</li>
                  <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">6. Your Privacy Rights</h2>
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc ml-6 mt-3 space-y-3 text-white/70 text-sm">
                  <li>The right to access the personal information we hold about you.</li>
                  <li>The right to request the correction of inaccurate data.</li>
                  <li>The right to request the deletion of your personal information under certain conditions.</li>
                  <li>The right to opt-out of receiving marketing communications.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">7. Third-Party Links</h2>
                <p>
                  Our website may contain links to external sites not operated by us. We are not responsible for the content or privacy practices of these third-party websites. We encourage you to review the privacy policies of any site you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-white/10 pb-2">8. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to us:
                </p>
                <div className="space-y-3 text-sm bg-black/40 p-8 rounded-sm border border-white/10 shadow-inner">
                  <p><strong className="text-luxury-gold block mb-1">Email:</strong> <a href={`mailto:${contactInfo.email}`} className="text-white hover:text-luxury-gold transition-colors">{contactInfo.email}</a></p>
                  <p><strong className="text-luxury-gold block mb-1">Phone:</strong> <span className="text-white">{contactInfo.phone}</span></p>
                  <p><strong className="text-luxury-gold block mb-1">Address:</strong> <span className="text-white">{contactInfo.address}</span></p>
                </div>
              </section>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default Privacy;

