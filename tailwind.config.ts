import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    darkMode: ["class"],
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
    			serif: ["Georgia", "merriweather", "serif"],
    			mono: ["Menlo", "monospace"],
    			dogica: ["Dogica", "monospace"],
    			'dogica-bold': ["DogicaBold", "monospace"],
    			easvhs: ["Easvhs", "monospace"],
    			montserrat: ["Montserrat", "sans-serif"],
				rajdhani: ["Rajdhani", "sans-serif"]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			black: '#101010',
    			yellowDark: '#DEA100',
    			celeste: '#41B5C4',
    			blackCustom: '101010'
    		},
    		boxShadow: {
    			'celeste-soft': '0px 0px 15px 5px rgba(65, 181, 196, 0.4)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	},
    	textShadow: {
    		none: 'none',
    		sm: '1px 1px 2px var(--tw-shadow-color)',
    		md: '2px 2px 4px var(--tw-shadow-color)',
    		lg: '3px 3px 6px var(--tw-shadow-color)',
    		xl: '4px 4px 8px var(--tw-shadow-color)'
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
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require("tailwind-scrollbar")({ nocompatible: true }),
        require("tailwindcss-animate"),
    ],
} satisfies Config;
