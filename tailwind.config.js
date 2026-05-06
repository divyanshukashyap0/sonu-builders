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
                stone: {
                    50: '#FDFBFA',
                    100: '#F5F5F4',
                    200: '#EAE6E3',
                    300: '#D6D3D1',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#292524',
                    900: '#1C1917',
                    950: '#0A0A0A',
                },
                luxury: {
                    gold: '#D4AF37',
                    'gold-light': '#F4DFB0',
                    black: '#0a0a0a',
                    charcoal: '#1a1a1a',
                    white: '#F9F8F6',
                    obsidian: '#0a0a0a',
                    bronze: '#8E6D45',
                    champagne: '#E5D1B8',
                },
                'warm-beige': '#e0e0e0',
                'ivory-pearl': '#F2F0E9',
                'premium-stone': '#E6E4DC',
                primary: {
                    green: '#1ec655',
                    'green-dark': '#17a348'
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                body: ['"Inter"', 'sans-serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            boxShadow: {
                'luxury': '0 20px 40px -5px rgba(0,0,0,0.3)',
                'luxury-hover': '0 30px 60px -10px rgba(0,0,0,0.4)',
                'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
                'glow-green': '0 0 20px rgba(30, 198, 85, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                'premium': '0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -5px rgba(0,0,0,0.4)',
            },
            backgroundImage: {
                'grain': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-cinematic': 'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.8) 100%)',
            }
        },
    },
    plugins: [],
}
