import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { useCompanyData } from '../hooks/useCompanyData';

const Terms: React.FC = () => {
  const { name } = useCompanyData();
  const [customContent, setCustomContent] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', 'legal'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().termsContent) {
        setCustomContent(docSnap.data().termsContent);
      } else {
        setCustomContent(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      <SEO 
        title={`Terms and Conditions | ${name}`} 
        description={`Standard terms and conditions for engaging with ${name} for interior design and construction services.`}
      />
      <div className="pt-24 min-h-screen bg-[#FAF8F5]">
        <Section className="py-20 text-[#171717]">
          <div className="max-w-4xl mx-auto bg-white border border-stone-200/80 p-10 md:p-16 shadow-luxury rounded-2xl">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-6">
              Terms and Conditions
            </h1>
            <p className="text-sm text-stone-500 mb-12 italic border-l-2 border-luxury-gold pl-4">Last Updated: {new Date().toLocaleDateString()}</p>
            
            {customContent ? (
              <div className="whitespace-pre-wrap text-stone-700 leading-relaxed font-normal">
                {customContent}
              </div>
            ) : (
              <div className="space-y-8 text-stone-700 leading-relaxed font-normal">
                <section>
                  <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-stone-200 pb-2">1. Introduction</h2>
                  <p>
                    These Terms and Conditions govern your use of the website and services provided by {name}. By accessing or using our website, or when engaging our interior design and construction services, you agree to be bound by these terms in full.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-stone-200 pb-2">2. Services Scope</h2>
                  <p>
                    {name} offers premium interior design, bespoke furnishing, and comprehensive civil construction services. All project timelines, material specifications, and deliverables will be distinctly agreed upon in a secondary customized client agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-stone-200 pb-2">3. Quotations and Payments</h2>
                  <p>
                    Any provided quotations remain valid for a period of 30 days. We operate on a staged payment structure. A non-refundable mobilization advance is required prior to commencement of any design or execution work, as specified in your individual contract.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-stone-200 pb-2">4. Intellectual Property</h2>
                  <p>
                    All 3D renderings, floor plans, and custom design schemes presented by {name} remain the intellectual property of the company until fully compensated. Unauthorized use or reproduction of these materials is strictly prohibited.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-stone-200 pb-2">5. Warranties and Limitations</h2>
                  <p>
                    We guarantee the quality of our workmanship and materials applied against manufacturing defects, subject to standard industry warranties. We are not liable for incidental or consequential damages resulting from delays beyond our immediate control (e.g., acts of nature, material shortages).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-luxury-gold mb-4 border-b border-stone-200 pb-2">6. Governing Law</h2>
                  <p>
                    These Terms are formulated in accordance with the jurisdiction governing our registered primary office location. Any disputes emerging from these terms will fall strictly under the jurisdiction of the corresponding local courts.
                  </p>
                </section>
              </div>
            )}
          </div>
        </Section>
      </div>
    </>
  );
};

export default Terms;
