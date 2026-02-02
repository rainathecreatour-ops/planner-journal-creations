import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1f2937',
        blush: '#f3e8ff',
        mint: '#ecfdf3',
        sky: '#eff6ff'
      }
    }
  },
  plugins: []
};

export default config;
