import React, { useState } from 'react';
import { Calculator, Home, Plus, Minus, IndianRupee } from 'lucide-react';

interface Room {
    name: string;
    area: number;
    level: 'basic' | 'premium' | 'luxury';
}

const roomTypes = [
    { id: 'living', name: 'Living Room', icon: '🛋️' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'dining', name: 'Dining Room', icon: '🍽️' },
    { id: 'study', name: 'Study Room', icon: '📚' }
];

const pricePerSqFt = {
    basic: 1200,
    premium: 2000,
    luxury: 3500
};

const levelDetails = {
    basic: {
        name: 'Essential',
        description: 'Quality materials, functional design',
        features: ['Local materials', 'Standard finishes', 'Basic lighting', '1-year warranty']
    },
    premium: {
        name: 'Premium',
        description: 'Premium brands, elegant aesthetics',
        features: ['Branded hardware', 'Designer tiles', 'Premium lighting', '3-year warranty']
    },
    luxury: {
        name: 'Luxury',
        description: 'Imported materials, bespoke design',
        features: ['Imported fittings', 'Marble & brass', 'Designer fixtures', '5-year warranty']
    }
};

export const BudgetEstimator: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [currentArea, setCurrentArea] = useState('');
    const [currentLevel, setCurrentLevel] = useState<'basic' | 'premium' | 'luxury'>('premium');

    const addRoom = () => {
        if (!currentRoom || !currentArea || parseInt(currentArea) <= 0) return;

        const room: Room = {
            name: roomTypes.find(r => r.id === currentRoom)?.name || '',
            area: parseInt(currentArea),
            level: currentLevel
        };

        setRooms([...rooms, room]);
        setCurrentRoom('');
        setCurrentArea('');
    };

    const removeRoom = (index: number) => {
        setRooms(rooms.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return rooms.reduce((total, room) => {
            return total + (room.area * pricePerSqFt[room.level]);
        }, 0);
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} L`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const total = calculateTotal();
    const gst = total * 0.18;
    const grandTotal = total + gst;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-luxury p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Calculator className="w-6 h-6 text-luxury-gold" />
                        <h3 className="text-2xl font-serif font-bold text-luxury-charcoal">
                            Add Rooms
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {/* Room Type */}
                        <div>
                            <label className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                Room Type
                            </label>
                            <select
                                value={currentRoom}
                                onChange={(e) => setCurrentRoom(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                            >
                                <option value="">Select room type</option>
                                {roomTypes.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.icon} {room.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Area */}
                        <div>
                            <label className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                Area (sq ft)
                            </label>
                            <input
                                type="number"
                                value={currentArea}
                                onChange={(e) => setCurrentArea(e.target.value)}
                                placeholder="Enter area in square feet"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                            />
                        </div>

                        {/* Quality Level */}
                        <div>
                            <label className="block text-sm font-semibold text-luxury-charcoal mb-2">
                                Quality Level
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['basic', 'premium', 'luxury'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setCurrentLevel(level)}
                                        className={`p-4 border-2 rounded-lg text-center transition-all ${currentLevel === level
                                                ? 'border-luxury-gold bg-luxury-gold/10'
                                                : 'border-gray-200 hover:border-luxury-gold/50'
                                            }`}
                                    >
                                        <p className="font-semibold text-sm text-luxury-charcoal">
                                            {levelDetails[level].name}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            ₹{pricePerSqFt[level]}/sq ft
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={addRoom}
                            disabled={!currentRoom || !currentArea}
                            className="w-full bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white px-6 py-3 rounded-lg font-semibold hover:shadow-luxury-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Room
                        </button>
                    </div>

                    {/* Added Rooms List */}
                    {rooms.length > 0 && (
                        <div className="mt-8">
                            <h4 className="font-semibold text-luxury-charcoal mb-4">Your Rooms</h4>
                            <div className="space-y-3">
                                {rooms.map((room, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-luxury-beige/20 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-luxury-charcoal">{room.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {room.area} sq ft • {levelDetails[room.level].name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-semibold text-luxury-gold">
                                                {formatCurrency(room.area * pricePerSqFt[room.level])}
                                            </p>
                                            <button
                                                onClick={() => removeRoom(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                <div className="lg:col-span-1">
                    <div className="bg-luxury-charcoal text-white rounded-2xl shadow-luxury p-6 sticky top-24">
                        <h4 className="text-xl font-serif font-bold mb-6">Estimate Summary</h4>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-gray-300">Total Rooms</span>
                                <span className="font-semibold">{rooms.length}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-gray-300">Subtotal</span>
                                <span className="font-semibold">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                <span className="text-gray-300">GST (18%)</span>
                                <span className="font-semibold">{formatCurrency(gst)}</span>
                            </div>
                        </div>

                        <div className="bg-luxury-gold/20 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-300 mb-1">Grand Total</p>
                            <p className="text-3xl font-serif font-bold text-luxury-gold">
                                {formatCurrency(grandTotal)}
                            </p>
                        </div>

                        <a
                            href="/contact"
                            className="block w-full bg-luxury-gold text-luxury-charcoal px-6 py-3 rounded-lg font-semibold text-center hover:bg-luxury-gold/90 transition-colors"
                        >
                            Get Detailed Quote
                        </a>

                        <p className="text-xs text-gray-400 mt-4 text-center">
                            *Actual costs may vary based on specific requirements
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetEstimator;
