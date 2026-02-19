/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'neo-yellow': 'var(--neo-yellow)',
                'neo-pink': 'var(--neo-pink)',
                'neo-blue': 'var(--neo-blue)',
                'neo-green': 'var(--neo-green)',
                'neo-purple': 'var(--neo-purple)',
                'neo-orange': 'var(--neo-orange)',
                'neo-red': 'var(--neo-red)',
                'neo-white': 'var(--neo-white)',
                'neo-black': 'var(--neo-black)',
            },
            fontFamily: {
                'display': ['"Space Grotesk"', 'sans-serif'],
                'mono': ['"JetBrains Mono"', 'monospace'],
            },
            boxShadow: {
                'hard': '4px 4px 0px 0px #000',
                'hard-sm': '2px 2px 0px 0px #000',
                'hard-lg': '8px 8px 0px 0px #000',
                'hard-xl': '12px 12px 0px 0px #000',
            }
        },
    },
    plugins: [],
    safelist: [
        { pattern: /^(bg|text|border)-neo-/ },
    ],
}
