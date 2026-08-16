/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        "mulish": ["Mulish"],
        "barlow": ["Barlow"],
        "barlow-cond": ["Barlow Condensed"],
        "dm-mono": ["DM Mono"]
      }
    },
  },
  plugins: [],
}

