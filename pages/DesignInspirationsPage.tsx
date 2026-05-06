import React from 'react';
import DesignInspirations from '../components/luxury/DesignInspirations';
import SEO from '../components/SEO';

const DesignInspirationsPage: React.FC = () => {
    return (
        <div className="page-transition">
            <SEO 
                title="Interior Design Inspirations"
                description="Explore ultra-premium interior design concepts by Sonu Enterprises. World-class modular kitchens, master bedrooms, and luxury living spaces."
            />
            <DesignInspirations />
        </div>
    );
};

export default DesignInspirationsPage;
