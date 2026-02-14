/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                luxury: {
                    gold: '#D4AF37',
                    'gold-light': '#F4DFB0',
                    black: '#0a0a0a',
                    charcoal: '#1a1a1a',
                    white: '#F9F8F6', // Softened form #FCFBFA
                    obsidian: '#0a0a0a' // Matching luxury-black based on index.css
                },
                'warm-beige': '#e0e0e0', // from index.css warm-gray/beige context
                'ivory-pearl': '#F2F0E9', // Warm Beige/Off-White
                'premium-stone': '#E6E4DC', // Slightly darker warm gray for sections
                primary: {
                    green: '#1ec655',
                    'green-dark': '#17a348'
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                body: ['"Montserrat"', 'sans-serif'],
                sans: ['"Montserrat"', 'sans-serif'],
            },
            boxShadow: {
                'luxury': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'luxury-hover': '0 16px 32px rgba(0, 0, 0, 0.15)',
                'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
                'glow-green': '0 0 20px rgba(30, 198, 85, 0.3)',
            }
        },
    },
    plugins: [],
}
