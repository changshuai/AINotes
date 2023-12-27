import type { Config } from 'tailwindcss'

const config: Config = {
  // content: [
  //   './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  //   './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  //   './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  // ],
  // theme: {
  //   extend: {
  //     backgroundImage: {
  //       'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  //       'gradient-conic':
  //         'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  //     },
  //   },
  // },
  // plugins: [],

  darkMode: ["class", ".dark-theme"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./ui/**/*.{js,ts,jsx,tsx}",
    `src/**/*.{js,ts,jsx,tsx}`,
    "../../packages/core/src/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-title)", "system-ui", "sans-serif"],
        default: ["var(--font-default)", "system-ui", "sans-serif"],
      },
      colors: {
        white: "var(--novel-white)",
        stone: {
          50: "var(--novel-stone-50)",
          100: "var(--novel-stone-100)",
          200: "var(--novel-stone-200)",
          300: "var(--novel-stone-300)",
          400: "var(--novel-stone-400)",
          500: "var(--novel-stone-500)",
          600: "var(--novel-stone-600)",
          700: "var(--novel-stone-700)",
          800: "var(--novel-stone-800)",
          900: "var(--novel-stone-900)",
        },
      },
    },
  },
  plugins: [
    // Tailwind plugins
    // require("@tailwindcss/typography"),
    // require("tailwindcss-animate"),
  ],
}
export default config
