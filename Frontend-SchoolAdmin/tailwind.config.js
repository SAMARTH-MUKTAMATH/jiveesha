/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode support
    theme: {
        extend: {
            colors: {
                primary: '#135bec',
                secondary: '#64748b',
                background: {
                    light: '#f8fafc', // slate-50
                    dark: '#0f172a',  // slate-900
                }
            },
            fontFamily: {
                display: ['Lexend', 'sans-serif'],
                body: ['Lexend', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
