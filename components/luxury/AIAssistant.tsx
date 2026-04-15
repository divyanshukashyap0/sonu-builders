import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCompanyData } from '../../hooks/useCompanyData';

type ConversationStep = 'GREETING' | 'ASK_NAME' | 'ASK_PHONE' | 'ASK_PROBLEM' | 'FINALIZING';

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<ConversationStep>('GREETING');
    const [userData, setUserData] = useState({ name: '', phone: '', problem: '' });
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { contactInfo } = useCompanyData();

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isProcessing]);

    // Initialize Conversation with time-based greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = getTimeBasedGreeting();
            addAssistantMessage(`${greeting}! I'm here to help you. To get started, may I know your name?`);
            setStep('ASK_NAME');
        }
    }, [isOpen]);

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        if (hour < 21) return "Good evening";
        return "Namaste";
    };

    const addAssistantMessage = (text: string) => {
        setMessages(prev => [...prev, { role: 'assistant', text }]);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isProcessing) return;

        const userText = inputText.trim();
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInputText('');
        setIsProcessing(true);

        setTimeout(async () => {
            switch (step) {
                case 'ASK_NAME':
                    setUserData(prev => ({ ...prev, name: userText }));
                    addAssistantMessage(`Pleasure to meet you, ${userText}! Could you please share your contact number so we can reach out to you?`);
                    setStep('ASK_PHONE');
                    break;

                case 'ASK_PHONE':
                    setUserData(prev => ({ ...prev, phone: userText }));
                    addAssistantMessage(`Got it. Finally, please tell us briefly about your requirement or the problem you're facing?`);
                    setStep('ASK_PROBLEM');
                    break;

                case 'ASK_PROBLEM':
                    const finalData = { ...userData, problem: userText };
                    setUserData(finalData);
                    addAssistantMessage(`Thank you! I'm submitting your request now...`);
                    setStep('FINALIZING');
                    await handleFinalSubmission(finalData);
                    break;

                default:
                    break;
            }
            setIsProcessing(false);
        }, 1000);
    };

    const handleFinalSubmission = async (data: typeof userData) => {
        try {
            // 1. Save to Firestore (chat_inquiries)
            await addDoc(collection(db, 'chat_inquiries'), {
                ...data,
                status: 'New',
                createdAt: serverTimestamp(),
            });

            // 2. Submit to FormSubmit (Email)
            const form = document.createElement('form');
            form.action = `https://formsubmit.co/${encodeURIComponent(contactInfo.email)}`;
            form.method = 'POST';

            const payload = {
                Name: data.name,
                Phone: data.phone,
                Inquiry: data.problem,
                Source: 'Chat Assistant'
            };

            for (const [key, value] of Object.entries(payload)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            }

            // Hidden configurations for FormSubmit
            const configs = {
              '_subject': `New Chat Inquiry from ${data.name}`,
              '_captcha': 'false',
              '_template': 'table'
            };

            for (const [key, value] of Object.entries(configs)) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value;
              form.appendChild(input);
            }

            document.body.appendChild(form);
            
            // We use fetch for FormSubmit to avoid page reload if possible, 
            // but FormSubmit usually works best via form submission.
            // To maintain SPA feel, we'll try a silent post
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            document.body.removeChild(form);

            addAssistantMessage(`Success! Your request has been sent to our team. We'll be in touch very soon. Have a great day!`);
            
            // Auto close after 3 seconds
            setTimeout(() => {
                setIsOpen(false);
                // Reset for next time
                setMessages([]);
                setStep('GREETING');
            }, 3000);

        } catch (error) {
            console.error("Submission error:", error);
            addAssistantMessage("I encountered an issue saving your request. Please call us directly for immediate assistance.");
        }
    };

    if (location.pathname.startsWith('/admin')) return null;

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
                                    <MessageSquare className="w-5 h-5 text-luxury-gold" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-white text-lg lowercase">contact</h3>
                                    <p className="text-[10px] text-luxury-gold/80 uppercase tracking-widest">Online Assistant</p>
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
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] bg-neutral-900/95 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-luxury-gold/10'}`}>
                                        {msg.role === 'user' ? <User size={14} className="text-gray-300" /> : <Bot size={14} className="text-luxury-gold" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user'
                                        ? 'bg-luxury-gold text-white rounded-br-none shadow-glow-gold'
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
                                    <div className="bg-neutral-800 border border-white/10 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />
                                        <span className="text-[10px] text-luxury-gold uppercase tracking-widest font-bold">Typing...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        {step !== 'FINALIZING' && (
                            <form onSubmit={handleSendMessage} className="p-4 bg-neutral-900 border-t border-white/5 flex items-center gap-2">
                                <input
                                    type={step === 'ASK_PHONE' ? 'tel' : 'text'}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={
                                        step === 'ASK_NAME' ? "Enter your name..." :
                                        step === 'ASK_PHONE' ? "Enter phone number..." :
                                        "How can we help?"
                                    }
                                    className="flex-1 bg-white/5 border border-white/10 focus:border-luxury-gold/50 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 outline-none transition-all"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isProcessing}
                                    className="p-3 bg-luxury-gold text-white rounded-xl hover:bg-luxury-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-gold"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        )}
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
