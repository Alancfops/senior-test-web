/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        stf: '12px',
        'stf-sm': '8px',
        'stf-lg': '16px',
      },
      boxShadow: {
        stf: '0 1px 3px var(--stf-card-shadow)',
        'stf-md': '0 4px 12px var(--stf-card-shadow)',
      },
    },
  },
  plugins: [],
};
