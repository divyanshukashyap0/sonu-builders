import React, { useState } from 'react';
import { ArrowRight, Check, Home, Sparkles } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: {
        text: string;
        style: string;
        image?: string;
    }[];
}

const questions: Question[] = [
    {
        id: 1,
        question: "What's your ideal color palette?",
        options: [
            { text: 'Neutral whites & beiges', style: 'minimal' },
            { text: 'Rich jewel tones', style: 'luxury' },
            { text: 'Earthy browns & greens', style: 'traditional' },
            { text: 'Bold black & gold', style: 'contemporary' }
        ]
    },
    {
        id: 2,
        question: 'How would you describe your lifestyle?',
        options: [
            { text: 'Minimalist & organized', style: 'minimal' },
            { text: 'Sophisticated & elegant', style: 'luxury' },
            { text: 'Warm & family-oriented', style: 'traditional' },
            { text: 'Modern & trendy', style: 'contemporary' }
        ]
    },
    {
        id: 3,
        question: 'What type of furniture appeals to you?',
        options: [
            { text: 'Clean lines & functional', style: 'minimal' },
            { text: 'Plush & luxurious', style: 'luxury' },
            { text: 'Classic wood & ornate', style: 'traditional' },
            { text: 'Sleek & statement pieces', style: 'contemporary' }
        ]
    },
    {
        id: 4,
        question: 'Your dream vacation spot?',
        options: [
            { text: 'Scandinavian cabin', style: 'minimal' },
            { text: 'European palace', style: 'luxury' },
            { text: 'Indian heritage hotel', style: 'traditional' },
            { text: 'Modern city loft', style: 'contemporary' }
        ]
    }
];

const styleResults = {
    minimal: {
        title: 'Minimalist Modern',
        description: 'Clean, clutter-free spaces with functional elegance.',
        features: ['Neutral color palette', 'Multi-functional furniture', 'Maximum natural light', 'Hidden storage solutions'],
        recommendation: 'Consider our Japanese-inspired designs or Scandinavian aesthetics.'
    },
    luxury: {
        title: 'Luxury Opulence',
        description: 'Rich textures, premium materials, and sophisticated elegance.',
        features: ['Premium marble & brass', 'Statement chandeliers', 'Plush fabrics & velvets', 'Custom furniture pieces'],
        recommendation: 'Explore our premium collection with imported finishes and designer fixtures.'
    },
    traditional: {
        title: 'Traditional Charm',
        description: 'Timeless Indian aesthetics with warm, inviting spaces.',
        features: ['Solid wood furniture', 'Intricate carvings', 'Warm earthy tones', 'Cultural artifacts'],
        recommendation: 'Our heritage collection blends traditional craftsmanship with modern comfort.'
    },
    contemporary: {
        title: 'Contemporary Chic',
        description: 'Bold, statement-making designs for the modern homeowner.',
        features: ['Contrasting colors', 'Geometric patterns', 'Mixed materials', 'Smart home integration'],
        recommendation: 'Check out our modern Italian designs with smart automation.'
    }
};

export const StyleFinderQuiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showLeadForm, setShowLeadForm] = useState(false);

    const handleAnswer = (style: string) => {
        const newAnswers = [...answers, style];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
        }
    };

    const getResult = () => {
        const styleCounts: Record<string, number> = {};
        answers.forEach(style => {
            styleCounts[style] = (styleCounts[style] || 0) + 1;
        });

        const topStyle = Object.keys(styleCounts).reduce((a, b) =>
            styleCounts[a] > styleCounts[b] ? a : b
        );

        return styleResults[topStyle as keyof typeof styleResults];
    };

    const restart = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(false);
        setShowLeadForm(false);
        setUserEmail('');
    };

    const handleGetDesigns = () => {
        setShowLeadForm(true);
    };

    if (showResult) {
        const result = getResult();

        return (
            <div className="max-w-3xl mx-auto">
                {!showLeadForm ? (
                    <div className="bg-white rounded-2xl shadow-luxury p-8 lg:p-12">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-10 h-10 text-luxury-gold" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mb-3">
                                Your Style: {result.title}
                            </h2>
                            <p className="text-gray-600 text-lg">{result.description}</p>
                        </div>

                        <div className="space-y-3 mb-8">
                            <p className="font-semibold text-luxury-charcoal">Perfect for you:</p>
                            {result.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-luxury-beige/30 rounded-lg p-6 mb-8">
                            <p className="text-luxury-charcoal">
                                <strong>Our Recommendation:</strong> {result.recommendation}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGetDesigns}
                                className="flex-1 bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white px-8 py-4 rounded-lg font-semibold hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Get Personalized Designs
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={restart}
                                className="px-8 py-4 border-2 border-luxury-gold text-luxury-gold rounded-lg font-semibold hover:bg-luxury-gold hover:text-white transition-all duration-300"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-luxury p-8 lg:p-12">
                        <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-6 text-center">
                            Get Your Personalized Design Portfolio
                        </h3>
                        <p className="text-gray-600 text-center mb-8">
                            We'll email you curated {result.title.toLowerCase()} designs that match your style.
                        </p>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Thank you! Check your email for designs.'); restart(); }}>
                            <input
                                type="email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white px-8 py-4 rounded-lg font-semibold hover:shadow-luxury-hover transition-all duration-300"
                            >
                                Send Me Designs
                            </button>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-luxury p-8 lg:p-12">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-luxury-gold to-luxury-bronze transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-luxury-charcoal mb-8 text-center">
                    {questions[currentQuestion].question}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option.style)}
                            className="p-6 border-2 border-gray-200 rounded-xl hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all duration-300 text-left group"
                        >
                            <p className="font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">
                                {option.text}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StyleFinderQuiz;
