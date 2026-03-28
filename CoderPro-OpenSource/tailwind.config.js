/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00F0FF',
          green: '#39FF14',
          magenta: '#FF003C',
          dark: 'rgba(5, 5, 10, 0.2)', // 进一步降低底色，提高通透度
          panel: 'rgba(10, 10, 15, 0.15)', // 极度透明的面板底色
          border: 'rgba(255, 255, 255, 0.15)', // 稍微提亮边框增加质感
          glow: 'rgba(0, 240, 255, 0.15)'
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'glass': 'none',
        'glass-inset': 'none',
        'neon-cyan': 'none',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        'glass-glow': 'radial-gradient(circle at 50% 0%, rgba(0,240,255,0.1) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}