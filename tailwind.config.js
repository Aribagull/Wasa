/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: '#F1F8FE',
        DarkBlue: '#0c2534',
      },
      screens: {
        '3xl': '1920px', 
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'], 
        body: ['Open Sans', 'sans-serif'], 
        inter: ['Inter', 'sans-serif'],    
      },
       boxShadow: {
        'custom-deep': '0px 4px 16px rgba(17, 17, 26, 0.05), 0px 8px 32px rgba(17, 17, 26, 0.05)',
      },
    },
  },
  plugins: [],
};
