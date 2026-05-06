import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface EstimationCosts {
    baseRates: {
        essential: number;
        premium: number;
        luxury: number;
    };
    tiles: {
        vitrified: number;
        marble: number;
        granite: number;
        wooden: number;
        spc: number;
        microcement: number;
        kotaStone: number;
    };
    wall: {
        paint: number;
        texturePaint: number;
        wallpaper: number;
        wallPanels: number;
        marbleCladding: number;
        woodenPanels: number;
    };
    falseCeiling: {
        pop: number;
        gypsum: number;
        wooden: number;
        coveLighting: number;
        ledStrip: number;
    };
    kitchen: {
        straight: number;
        lShape: number;
        uShape: number;
        parallel: number;
        island: number;
        acrylic: number;
        laminate: number;
        puFinish: number;
        veneer: number;
        glassFinish: number;
        graniteCounter: number;
        quartzCounter: number;
        marbleCounter: number;
    };
    wardrobe: {
        sliding: number;
        hinged: number;
        walkIn: number;
        laminate: number;
        acrylic: number;
        glass: number;
        veneer: number;
    };
    tvUnit: {
        floating: number;
        marble: number;
        wooden: number;
        ledBacklit: number;
    };
    bathroom: {
        premiumTiles: number;
        vanityUnit: number;
        showerPartition: number;
        premiumFittings: number;
    };
    lighting: {
        spotlights: number;
        chandelier: number;
        smartLighting: number;
        decorative: number;
    };
    fixedItems: {
        tvUnit: number;
        modularKitchenBase: number;
        wardrobePerSqFt: number;
        falseCeilingPerSqFt: number;
    };
    styleTiers: {
        id: string;
        name: string;
        image: string;
        pricePerSqFt: number;
    }[];
    categoryImages?: Record<string, string>;
    optionImages?: Record<string, Record<string, string>>;
    gstRate: number;
}

export const useEstimationCosts = () => {
    const [costs, setCosts] = useState<EstimationCosts | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'estimation_costs'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as any;
                
                // Ensure all fields exist by merging with defaults
                const completeData: EstimationCosts = {
                    ...getDefaults(),
                    ...data
                };
                
                setCosts(completeData);
            } else {
                const defaults = getDefaults();
                setDoc(doc(db, 'settings', 'estimation_costs'), defaults);
                setCosts(defaults);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const updateCosts = async (newCosts: EstimationCosts) => {
        await setDoc(doc(db, 'settings', 'estimation_costs'), newCosts);
    };

    return { costs, loading, updateCosts };
};

function getDefaults(): EstimationCosts {
    return {
        baseRates: { essential: 1200, premium: 2000, luxury: 3500 },
        tiles: { 
            vitrified: 120, 
            marble: 250, 
            granite: 180, 
            wooden: 220, 
            spc: 160, 
            microcement: 350, 
            kotaStone: 90 
        },
        wall: {
            paint: 45,
            texturePaint: 150,
            wallpaper: 80,
            wallPanels: 450,
            marbleCladding: 1200,
            woodenPanels: 650
        },
        falseCeiling: {
            pop: 110,
            gypsum: 130,
            wooden: 450,
            coveLighting: 5000,
            ledStrip: 2500
        },
        kitchen: {
            straight: 85000,
            lShape: 125000,
            uShape: 185000,
            parallel: 155000,
            island: 225000,
            acrylic: 45000,
            laminate: 25000,
            puFinish: 65000,
            veneer: 85000,
            glassFinish: 75000,
            graniteCounter: 150,
            quartzCounter: 450,
            marbleCounter: 350
        },
        wardrobe: {
            sliding: 2200,
            hinged: 1800,
            walkIn: 3500,
            laminate: 0,
            acrylic: 450,
            glass: 650,
            veneer: 850
        },
        tvUnit: {
            floating: 35000,
            marble: 65000,
            wooden: 45000,
            ledBacklit: 15000
        },
        bathroom: {
            premiumTiles: 150,
            vanityUnit: 25000,
            showerPartition: 18000,
            premiumFittings: 45000
        },
        lighting: {
            spotlights: 800,
            chandelier: 25000,
            smartLighting: 45000,
            decorative: 15000
        },
        fixedItems: {
            tvUnit: 25000,
            modularKitchenBase: 150000,
            wardrobePerSqFt: 1800,
            falseCeilingPerSqFt: 110
        },
        categoryImages: {
            flooring: 'https://images.unsplash.com/photo-1516528387618-afa90b13e000?auto=format&fit=crop&q=80',
            walls: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&q=80',
            ceiling: 'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80',
            kitchen: 'https://images.unsplash.com/photo-1556911220-e15595b6a9f9?auto=format&fit=crop&q=80',
            wardrobe: 'https://images.unsplash.com/photo-1558997519-83ec9c5230d7?auto=format&fit=crop&q=80',
            tv_unit: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80',
            bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80',
            lighting: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80'
        },
        optionImages: {
            tiles: {},
            wall: {},
            falseCeiling: {},
            kitchen: {},
            wardrobe: {},
            tvUnit: {},
            bathroom: {},
            lighting: {}
        },
        styleTiers: [
            { id: 'essential', name: 'Essential Quality', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80', pricePerSqFt: 1200 },
            { id: 'premium', name: 'Premium Designer', image: 'https://images.unsplash.com/photo-1616486341351-70ad52b6f44d?auto=format&fit=crop&q=80', pricePerSqFt: 2200 },
            { id: 'ultra-luxury', name: 'Ultra Luxury', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80', pricePerSqFt: 4500 }
        ],
        gstRate: 18
    };
}
