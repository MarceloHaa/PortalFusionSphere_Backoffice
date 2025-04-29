/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#27374D",
        secondary: "#526D82",
        tertiary: "#38475d",
        accent: "#9DB2BF",
        light: "#DDE6ED",
        dark: "#3b413c",
        neutral: "#9db5b2",
      },
    },
  },
  plugins: [],
};
