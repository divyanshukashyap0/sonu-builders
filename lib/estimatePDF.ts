import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EstimateData {
    clientDetails: {
        name: string;
        phone: string;
        email: string;
        location: string;
        propertyType: string;
        totalArea: number;
        timeline: string;
    };
    selections: Record<string, { material: string, notes: string, cost: number }>;
    costs: {
        items: Array<{ category: string, material: string, area: string, rate: number, total: number, categoryImage?: string }>;
        subtotal: number;
        gst: number;
        grandTotal: number;
    };
    companyName: string;
}

/**
 * Converts an image URL to Base64 string and returns dimensions.
 * Guaranteed to never throw; returns empty info if image fails.
 */
const getOriginalImageInfo = async (url: string): Promise<{ base64: string, width: number, height: number }> => {
    if (!url) return { base64: '', width: 0, height: 0 };
    try {
        // Fetch with timeout and error handling
        const response = await fetch(url, { cache: 'no-cache' }).catch(() => null);
        if (!response || !response.ok) {
            console.warn(`[PDF Engine] Image failed to load (404/Network): ${url}`);
            return { base64: '', width: 0, height: 0 };
        }
        
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                const img = new Image();
                img.onload = () => {
                    resolve({ base64, width: img.width, height: img.height });
                };
                img.onerror = () => {
                    resolve({ base64: '', width: 0, height: 0 });
                };
                img.src = base64;
            };
            reader.onerror = () => resolve({ base64: '', width: 0, height: 0 });
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error(`[PDF Engine] Critical image error:`, e);
        return { base64: '', width: 0, height: 0 };
    }
};

const formatCurrency = (num: number) => {
    return 'INR ' + num.toLocaleString('en-IN');
};

export const generateEstimatePDF = async (data: EstimateData) => {
    const doc = new jsPDF();
    const gold = [212, 175, 55]; // #D4AF37
    const copper = [184, 115, 51]; // #B87333
    const charcoal = [26, 26, 26]; // #1A1A1A
    const beige = [248, 245, 240];
    const white = [255, 255, 255];
    const grey = [180, 180, 180];

    // Pre-load Logo safely
    const logoInfo = await getOriginalImageInfo('/logo.png');
    const logoRatio = logoInfo.width > 0 ? logoInfo.width / logoInfo.height : 1;

    // Helper: Add Watermark (Global Background Logo)
    const addWatermark = () => {
        if (logoInfo.base64) {
            doc.saveGraphicsState();
            doc.setGState(new (doc as any).GState({ opacity: 0.03 }));
            const w = 150;
            const h = w / logoRatio;
            doc.addImage(logoInfo.base64, 'PNG', (210 - w) / 2, (297 - h) / 2, w, h);
            doc.restoreGraphicsState();
        }
    };

    const addHeader = (pageNumber: number) => {
        addWatermark();
        doc.setFillColor(white[0], white[1], white[2]);
        doc.rect(0, 0, 210, 25, 'F');
        
        if (logoInfo.base64) {
            const w = 15;
            const h = w / logoRatio;
            doc.addImage(logoInfo.base64, 'PNG', 20, (20 - h) / 2 + 5, w, h);
        }

        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
        doc.text('SONU ENTERPRISES & BUILDING DEVELOPERS', 40, 12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(copper[0], copper[1], copper[2]);
        doc.text('INTERIOR CONSTRUCTION & DESIGN', 40, 16);
        doc.setTextColor(grey[0], grey[1], grey[2]);
        doc.text(`Page ${pageNumber}`, 190, 14, { align: 'right' });
        doc.setDrawColor(copper[0], copper[1], copper[2]);
        doc.setLineWidth(0.3);
        doc.line(20, 22, 190, 22);
    };

    // --- PAGE 1: COVER PAGE ---
    doc.setFillColor(white[0], white[1], white[2]);
    doc.rect(0, 0, 210, 297, 'F');
    
    if (logoInfo.base64) {
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
        const w = 210;
        const h = w / logoRatio;
        doc.addImage(logoInfo.base64, 'PNG', 0, (297 - h) / 2, w, h);
        doc.restoreGraphicsState();
    }

    if (logoInfo.base64) {
        const w = 35;
        const h = w / logoRatio;
        doc.addImage(logoInfo.base64, 'PNG', 20, 20, w, h);
    }

    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.text('SONU ENTERPRISES', 60, 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(copper[0], copper[1], copper[2]);
    doc.text('& BUILDING DEVELOPERS', 60, 41);

    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(54);
    doc.text('Interior', 20, 120);
    doc.setTextColor(copper[0], copper[1], copper[2]);
    doc.setFont('times', 'italic');
    doc.text('Proposal', 20, 140);
    
    doc.setDrawColor(copper[0], copper[1], copper[2]);
    doc.setLineWidth(2);
    doc.line(20, 155, 80, 155);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.text('ESTIMATED COST SUMMARY', 20, 170);

    const clientY = 220;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(copper[0], copper[1], copper[2]);
    doc.text('CLIENT PROFILE', 20, clientY);
    
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.setFontSize(16);
    doc.text(data.clientDetails.name.toUpperCase(), 20, clientY + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.text(`${data.clientDetails.propertyType} | ${data.clientDetails.totalArea} Sq.ft`, 20, clientY + 18);
    doc.text(`${data.clientDetails.location}`, 20, clientY + 24);
    
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.text('"Designing Spaces, Creating Memories"', 20, clientY + 45);

    // --- PAGE 2: PROJECT OVERVIEW ---
    doc.addPage();
    addHeader(2);
    
    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.text('Project Overview', 20, 45);

    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(copper[0], copper[1], copper[2]);
    doc.text('Bespoke Interior Planning & Execution', 20, 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(80, 80, 80);
    const overviewText = `Thank you for choosing Sonu Enterprises & Building Developers. We are committed to transforming your vision into a living masterpiece. This proposal outlines the comprehensive cost architecture for your property, utilizing premium grade materials and expert craftsmanship. Every selection has been curated to reflect the highest standards of modern luxury and functional elegance.`;
    doc.text(overviewText, 20, 65, { maxWidth: 170, lineHeightFactor: 1.6 });

    autoTable(doc, {
        startY: 95,
        head: [['Specification', 'Project Data']],
        body: [
            ['Principal Client', data.clientDetails.name],
            ['Property Identity', data.clientDetails.propertyType],
            ['Project Location', data.clientDetails.location],
            ['Execution Timeline', data.clientDetails.timeline],
            ['Investment Tier', data.selections.budgetRange || 'Premium Bespoke'],
            ['Total Floor Coverage', `${data.clientDetails.totalArea} Sq.ft`],
        ],
        theme: 'plain',
        headStyles: { fillColor: white, textColor: copper, fontStyle: 'bold', fontSize: 11, font: 'times' },
        bodyStyles: { textColor: charcoal, cellPadding: 4, font: 'helvetica' },
        columnStyles: { 0: { fontStyle: 'bold', width: 60, textColor: grey } },
        margin: { left: 20, right: 20 },
        drawBottomLine: true
    });

    // --- PAGE 3: COST SUMMARY ---
    doc.addPage();
    addHeader(3);

    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.text('Financial Summary', 20, 45);

    autoTable(doc, {
        startY: 55,
        head: [['Work Category', 'Selected Material', 'Coverage', 'Rate (avg)', 'Total Amount']],
        body: data.costs.items.map(item => [
            item.category,
            item.material,
            item.area,
            formatCurrency(item.rate),
            formatCurrency(item.total)
        ]),
        headStyles: { fillColor: copper, textColor: white, fontStyle: 'bold', font: 'helvetica' },
        alternateRowStyles: { fillColor: beige },
        styles: { fontSize: 8.5, cellPadding: 5, font: 'helvetica' },
        margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.rect(100, finalY, 90, 50, 'F');
    
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('SUBTOTAL', 110, finalY + 15);
    doc.text(formatCurrency(data.costs.subtotal), 180, finalY + 15, { align: 'right' });
    
    doc.text('TAXES (GST 18%)', 110, finalY + 25);
    doc.text(formatCurrency(data.costs.gst), 180, finalY + 25, { align: 'right' });
    
    doc.setDrawColor(copper[0], copper[1], copper[2]);
    doc.line(110, finalY + 30, 180, finalY + 30);
    
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('GRAND TOTAL', 110, finalY + 42);
    doc.text(formatCurrency(data.costs.grandTotal), 180, finalY + 42, { align: 'right' });

    // --- PAGE 4+: DETAILED BREAKDOWN ---
    const categories = data.costs.items;
    
    for (let i = 0; i < categories.length; i++) {
        const item = categories[i];
        doc.addPage();
        addHeader(4 + i);
        
        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
        doc.setFont('times', 'bold');
        doc.setFontSize(36);
        doc.text(item.category, 20, 55);
        
        doc.setDrawColor(copper[0], copper[1], copper[2]);
        doc.setLineWidth(1);
        doc.line(20, 62, 100, 62);

        // Safely Render Category Image
        if (item.categoryImage) {
            const catInfo = await getOriginalImageInfo(item.categoryImage);
            if (catInfo.base64) {
                const catRatio = catInfo.width / catInfo.height;
                const w = 80;
                const h = w / catRatio;
                doc.addImage(catInfo.base64, 'JPEG', 115, 35, w, h, undefined, 'FAST');
            }
        }

        doc.setTextColor(grey[0], grey[1], grey[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('DETAILED SPECIFICATION', 20, 80);
        
        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
        doc.setFont('times', 'italic');
        doc.setFontSize(22);
        doc.text(item.material, 20, 92, { maxWidth: 90 });

        doc.setFillColor(beige[0], beige[1], beige[2]);
        doc.rect(0, 110, 150, 40, 'F');
        
        doc.setTextColor(copper[0], copper[1], copper[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('CATEGORY ALLOCATION', 20, 122);
        
        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
        doc.setFont('times', 'bold');
        doc.setFontSize(32);
        doc.text(formatCurrency(item.total), 20, 138);

        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Key Inclusions:', 20, 170);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const includes = getCategoryIncludes(item.category.toLowerCase());
        includes.forEach((text, idx) => {
            doc.text(`> ${text}`, 25, 180 + (idx * 8));
        });
    }

    // --- FINAL PAGE: THANK YOU ---
    doc.addPage();
    doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.rect(0, 0, 210, 297, 'F');
    
    if (logoInfo.base64) {
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.12 }));
        const w = 150;
        const h = w / logoRatio;
        doc.addImage(logoInfo.base64, 'PNG', (210 - w) / 2, (297 - h) / 2, w, h);
        doc.restoreGraphicsState();
    }

    doc.setFillColor(copper[0], copper[1], copper[2]);
    doc.rect(0, 280, 210, 17, 'F');

    if (logoInfo.base64) {
        const w = 40;
        const h = w / logoRatio;
        doc.addImage(logoInfo.base64, 'PNG', (210 - w) / 2, 40, w, h);
    }

    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('times', 'bold');
    doc.setFontSize(48);
    doc.text('Thank You', 105, 100, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text('EXPERIENCE THE LUXURY OF PRECISION', 105, 115, { align: 'center' });
    
    const infoY = 180;
    doc.setFont('times', 'italic');
    doc.setFontSize(22);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text('“Precision in planning, excellence in execution.”', 105, infoY, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grey[0], grey[1], grey[2]);
    doc.text('FOR INQUIRIES & CONSULTATION', 105, infoY + 25, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text('+91 9967044479', 105, infoY + 35, { align: 'center' });
    doc.text('sonu-builders.in', 105, infoY + 45, { align: 'center' });

    doc.save(`${data.clientDetails.name.replace(/\s/g, '_')}_Interior_Quotation.pdf`);
};

function getCategoryIncludes(categoryName: string) {
    const includes: any = {
        'flooring & stone': ['Premium material procurement', 'High-precision installation', 'Border & Skirting', 'Surface leveling & polishing'],
        'wall art & finish': ['Surface preparation & putty', 'Double coat premium paint/texture', 'Designer wallpaper application', 'Wall paneling structural support'],
        'the ceiling': ['Heavy-duty GI framework', 'Quality POP/Gypsum boards', 'Cove lighting channels', 'Flush finish with sanding'],
        'the kitchen': ['BWP Grade Marine Plywood', 'Soft-close tandem boxes', 'Heat & water resistant finishes', 'Countertop installation & sealing'],
        'wardrobe systems': ['Termite-proof internal carcass', 'High-quality hardware & hinges', 'Internal drawers & organizers', 'Loft storage options'],
        'the entertainment': ['Concealed wiring management', 'Veneer/Marble finish application', 'Backlit LED integration', 'Floating shelf support'],
        'luxury sanitary': ['Anti-skid floor treatment', 'Full-height wall tiling', 'Waterproofing layers', 'Sanitary fixture fitting'],
        'the lumina': ['Concealed wiring circuits', 'Fixture installation', 'Smart dimming support', 'Ambient & Task lighting balance']
    };
    
    for (const key in includes) {
        if (categoryName.includes(key) || key.includes(categoryName)) return includes[key];
    }
    
    return ['Premium Material', 'Expert Labor', 'Quality Assurance'];
}
