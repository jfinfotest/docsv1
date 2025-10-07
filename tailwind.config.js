/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[700]'),
            '--tw-prose-headings': theme('colors.gray[900]'),
            '--tw-prose-links': theme('colors.blue[600]'),
            '--tw-prose-bold': theme('colors.gray[900]'),
            '--tw-prose-invert-body': theme('colors.gray[300]'),
            '--tw-prose-invert-headings': theme('colors.gray[100]'),
            '--tw-prose-invert-links': theme('colors.blue[400]'),
            '--tw-prose-invert-bold': theme('colors.gray[100]'),
            // Reset default `code` styles from the typography plugin
            code: {
              fontWeight: 'inherit',
              color: 'inherit',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      }),
      colors: {
        primary: {
          '50': 'rgb(var(--color-primary-50) / <alpha-value>)',
          '100': 'rgb(var(--color-primary-100) / <alpha-value>)',
          '200': 'rgb(var(--color-primary-200) / <alpha-value>)',
          '300': 'rgb(var(--color-primary-300) / <alpha-value>)',
          '400': 'rgb(var(--color-primary-400) / <alpha-value>)',
          '500': 'rgb(var(--color-primary-500) / <alpha-value>)',
          '600': 'rgb(var(--color-primary-600) / <alpha-value>)',
          '700': 'rgb(var(--color-primary-700) / <alpha-value>)',
          '800': 'rgb(var(--color-primary-800) / <alpha-value>)',
          '900': 'rgb(var(--color-primary-900) / <alpha-value>)',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}