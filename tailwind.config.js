module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          green: "#1b8354",
          darkGreen: "#14573a",
          lightGreen: "#abefc6",
          background: "#ecfdf3",
          text: "#085d3a",
        },
        secondary: {
          background: "#ffffff",
          foreground: "#161616",
          light: "#f3f4f6",
          dark: "#384250",
        },
        accent: {
          DEFAULT: "#b42318",
          foreground: "#ffffff",
          light: "#f9fafb",
          dark: "#6c727e",
        },
        border: {
          primary: "#e5e7eb",
          secondary: "#9da4ae",
          light: "#d2d6db",
          dark: "#6c727e",
        },
        text: {
          primary: "#161616",
          secondary: "#384250",
          muted: "#6c727e",
          light: "#9da4ae",
          disabled: "#aeaeb2",
          white: "#ffffff",
          link: "#f5f5f5",
        },
      },
      boxShadow: {
        'custom': '0px 21px 43px rgba(27, 131, 84, 0.14)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(45deg, #14573a 0%, #1b8354 100%)',
      },
    },
  },
  plugins: [],
};