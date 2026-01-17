/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.{js,jsx,ts,tsx}", "./src/pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#a68b6a",
        lightPrimaryColor: "#c4a882",
        lighterPrimaryColor: "#d9c9b0",
        lightestPrimaryColor: "#f5f0e8",
        darkPrimaryColor: "#8b7355",
        beigeColor: "#a68b6a",
        beigePrimaryColor: "#a68b6a",
        secondaryColor: "#14213d",
        neutralColor: "#f5f0e8",
        LightSecondaryColor: "#14213d4d",
        lightestSecondaryColor: "#ecf0f9",
        lightBlack: "hsl(0deg 0% 60%)",
      },
      screens: {
        xs: "375px",
        sm: "480px",
        tablet: { min: "480px", max: "767px" },
        mdHeight: { raw: "(min-height:700px)" },
        lgHeight: { raw: "(min-height:850px)" },
      },
      fontFamily: {
        OpenSans: ["Open Sans", "sans-serif"],
        RobotoCondensed: ["Roboto Condensed", "sans-serif"],
        RobotoSlab: ["Roboto Slab", "serif"],
      },
    },
  },
  plugins: [],
}
