import React from 'react';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { useCompanyData } from '../hooks/useCompanyData';

const Privacy: React.FC = () => {
  const { name, contactInfo } = useCompanyData();

  return (
    <>
      <SEO 
        title={`Privacy Policy | ${name}`} 
        description={`Learn how ${name} handles and protects your personal data.`}
      />
      <div className="pt-24 min-h-screen bg-luxury-white dark:bg-luxury-charcoal">
        <Section className="py-20">
          <div className="max-w-4xl mx-auto bg-white dark:bg-luxury-obsidian p-10 md:p-16 shadow-luxury rounded-sm">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-12">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-8 text-luxury-charcoal/80 dark:text-white/80 leading-relaxed font-medium">
              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4">1. Data Collection</h2>
                <p>
                  At {name}, we are committed to safeguarding your privacy. We may collect personal identification information (Name, email address, phone number, etc.) when you willingly submit requests via our forms, subscribe to our newsletters, or interact with our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4">2. Usage of Data</h2>
                <p>
                  The data collected is utilized to:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2 text-luxury-charcoal/70 dark:text-white/70 text-sm">
                  <li>Provide custom design consultations and quotations.</li>
                  <li>Improve customer service and our platform's responsiveness.</li>
                  <li>Send periodic emails or messages regarding project updates.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4">3. Data Protection</h2>
                <p>
                  We adopt reasonable data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4">4. Sharing Personal Information</h2>
                <p>
                  We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any specific personal identification information with our business partners, trusted affiliates, and advertisers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4">5. Contacting Us</h2>
                <p>
                  If you have any questions or require modifications to your data concerning this Privacy Policy, your interactions with this site, or our data handling practices, please contact us at: <br/><br/>
                  <strong>Email:</strong> {contactInfo.email}
                </p>
              </section>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default Privacy;
