import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
        { role: 'assistant', text: "Namaste! I'm your luxury design consultant. Looking for a new kitchen, wardrobe, or full home renovation?" }
    ]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isProcessing]);

    // Don't show on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText;

        // Add User Message
        const newMessages = [...messages, { role: 'user', text: userText } as const];
        setMessages(newMessages);
        setInputText('');
        setIsProcessing(true);

        // Simple heuristic for demo purposes (Replace with OpenAI later)
        // If user mentions a phone number, we treat it as a lead
        const phoneRegex = /[0-9]{10}/;
        if (phoneRegex.test(userText)) {
            try {
                // Extract possible name (very naive, just first word if not "I")
                const name = "Website Visitor";

                // Save to Firestore
                await addDoc(collection(db, 'leads'), {
                    name: name,
                    phone: userText.match(phoneRegex)?.[0] || '',
                    source: 'AI Assistant',
                    status: 'New',
                    createdAt: new Date(),
                    projectType: 'Inquiry from Chat',
                    notes: userText
                });

                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        text: "Great! I've saved your details. Our senior designer will call you shortly to discuss your requirements."
                    }]);
                    setIsProcessing(false);
                }, 1500);
            } catch (error) {
                console.error("Error saving lead:", error);
                setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to the server. Please try calling us directly." }]);
                setIsProcessing(false);
            }
        } else {
            // General response simulation
            setTimeout(() => {
                let response = "That sounds interesting. Could you share your phone number so our team can send you the brochure and pricing details?";
                if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('cost')) {
                    response = "Our luxury interiors start from ₹1500/sqft. To get an exact quote, we'd need a site visit. Can we schedule one? Please share your number.";
                }

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: response
                }]);
                setIsProcessing(false);
            }, 1000);
        }
    };

    return (
        <div className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[350px] max-h-[600px] bg-neutral-900 border border-luxury-gold/20 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-luxury-charcoal p-4 flex justify-between items-center border-b border-luxury-gold/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center border border-luxury-gold/50">
                                    <Sparkles className="w-5 h-5 text-luxury-gold animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-white text-lg">Sonu AI</h3>
                                    <p className="text-xs text-luxury-gold/80">Virtual Designer</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] bg-neutral-900/95">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-luxury-gold/10'
                                        }`}>
                                        {msg.role === 'user' ? <User size={14} className="text-gray-300" /> : <Bot size={14} className="text-luxury-gold" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.role === 'user'
                                        ? 'bg-luxury-charcoal text-white rounded-br-none border border-white/10'
                                        : 'bg-neutral-800 text-gray-200 border border-white/10 rounded-bl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                                        <Bot size={14} className="text-luxury-gold" />
                                    </div>
                                    <div className="bg-neutral-800 border border-white/10 p-3 rounded-2xl rounded-bl-none shadow-sm">
                                        <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-neutral-900 border-t border-white/5 flex items-center gap-2">
                            <button
                                type="button"
                                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'hover:bg-white/5 text-gray-400'}`}
                                onClick={() => setIsListening(!isListening)}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type or speak..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-200 placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isProcessing}
                                className="p-2 bg-luxury-gold text-white rounded-full hover:bg-luxury-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 md:w-14 md:h-14 bg-luxury-gold text-white rounded-full shadow-glow-gold flex items-center justify-center pointer-events-auto border-2 border-white/20 z-50 hover:rotate-12 transition-transform"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default AIAssistant;
