import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    safelist: [
        {
            pattern: /text-shadow-.+/,
        },
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                serif: ["Merriweather", "serif"],
                mono: ["Menlo", "monospace"],
                dogica: ["Dogica", "monospace"],
                "dogica-bold": ["DogicaBold", "monospace"],
                easvhs: ["Easvhs", "monospace"],
            },
        },
        textShadow: {
            none: "none",
            sm: "1px 1px 2px var(--tw-shadow-color)",
            md: "2px 2px 4px var(--tw-shadow-color)",
            lg: "3px 3px 6px var(--tw-shadow-color)",
            xl: "4px 4px 8px var(--tw-shadow-color)",
        }
    },
    plugins: [
        require("tailwindcss-animated"),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "text-shadow": (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme("textShadow") }
            );
        }),
    ],
} satisfies Config;
