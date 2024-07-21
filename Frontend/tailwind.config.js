/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // List all possible theme classes you might use
    {
      pattern: /border-(lime|amber|emerald|violet|slate|blue|green|purple|pink)-(400|500|600|700)/,
      variants: ['hover']
    },
    {
      pattern: /bg-(lime|amber|emerald|violet|slate|blue|green|purple|pink)-(400|500|600|700)/,
      variants: ['hover']
    },
    {
      pattern: /text-(lime|amber|emerald|violet|slate|blue|green|purple|pink)-(400|500|600|700)/,
      variants: ['hover']
    }
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          '500': '#A7F432',
          '600': '#7AE02E',
          '700': '#5CC72B',
        },
      }
    },
  },
  
  plugins: [],
}
