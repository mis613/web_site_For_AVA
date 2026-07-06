/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
    50: '#f4f1f8',
    100: '#e4dbef',
    200: '#cec1e0',
    300: '#a874d1',
    400: '#8a4bc0',
    500: '#6c2fa3',
    600: '#581C87',   // 👈 yehi color aapka main purple hai
    700: '#4a1670',
    800: '#3c1259',
    900: '#2e0d42'
        },
        gold: {
          50: '#fbf6e7',
          100: '#f4e6bc',
          200: '#e8cf82',
          300: '#ddb85f',
          400: '#D8B15A',
          500: '#c69f4a',
          600: '#a68038'
        },
        sage: {
          50: '#f3f6ef',
          100: '#e2e9d8',
          200: '#cbd7b9',
          300: '#b8c9a0',
          400: '#A9B88F',
          500: '#95a579',
          600: '#7f8f66'
        },
        ink: '#3F4354',
        muted: '#6B7280',
        background: '#F7F7F9',
        surface: '#FFFFFF',
        border: '#E5E7EB'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(63, 67, 84, 0.10)',
        glow: '0 0 0 4px rgba(155, 139, 184, 0.14)'
      },
      keyframes: {
        wobble: {
          '0%': { transform: 'scale(1.05) rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(-3deg)' },
          '50%': { transform: 'scale(1.05) rotate(0deg)' },
          '75%': { transform: 'scale(1.05) rotate(3deg)' },
          '100%': { transform: 'scale(1.05) rotate(0deg)' }
        }
      },
      animation: {
        wobble: 'wobble 1s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
