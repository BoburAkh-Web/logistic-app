//  @type {import('tailwindcss').Config}
module.exports = {
  purge: ["./src/**/*.{html,js,jsx}"],
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    screens: {
      lg: "1148px",
      "tablet": { "max": "960px" },
      "tablet-mini": { "max": "900px" },
      "tablet-extra": { "max": "800px" },
      "mobile": { "max": "576px" },
      "mobile-mini": { "max": "400px" },
      "mobile-extra": { "max": "675px" },
    },
    container: {
      padding: "20px",
    },
    extend: {
      colors: {
        primaryClr: "#3e4095",
        white: "#FFFFFF",
        black: "#000000",
        lightBlack: "#333333",
        lightBlue: "#2F343A",
        grey: "#393F47",
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(0deg, rgba(47, 52, 58, 0.75) 0%, rgba(47, 52, 58, 0.75) 100%), url('/src/images/hero-bg.jpg')",
      },
      boxShadow: {
        "box-shadow": "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
      fontFamily: {
        roboto: ["Roboto"],
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        large: 700,
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out", // Adjust the duration and easing as needed
        fadeOut: "fadeOut 1s ease-out", // Adjust the duration and easing as needed
      },
    },
  },
  plugins: [],
};
