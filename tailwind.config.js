/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      red: 'red',
      blue: '#0082fc'
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
