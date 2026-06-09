import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172126",
        basalt: "#25313a",
        lotus: "#b7375f",
        marigold: "#d08b1f",
        neem: "#36715d",
        copper: "#a85f37",
        ivory: "#f8f3e7",
        mist: "#edf1ef",
        signal: "#176f8f",
        night: "#101820"
      },
      boxShadow: {
        studio: "0 18px 45px rgba(23, 33, 38, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
