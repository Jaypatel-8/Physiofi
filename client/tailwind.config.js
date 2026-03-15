/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color - #13a581 (Teal Green)
        primary: {
          50: '#e6f5f2',
          100: '#b3e4d6',
          200: '#80d3ba',
          300: '#4dc29e',
          400: '#1ab182',
          500: '#13a581', // Primary - Teal Green
          600: '#0f8a6a',
          700: '#0b6f53',
          800: '#0d5a4a',
          900: '#004a2e',
        },
        // Secondary Color - #177076 (Deep Teal)
        secondary: {
          50: '#e0f0f0',
          100: '#b3d9d9',
          200: '#80c2c2',
          300: '#4dabab',
          400: '#1a9494',
          500: '#177076', // Secondary - Deep Teal
          600: '#125a5a',
          700: '#0d4444',
          800: '#082e2e',
          900: '#031818',
        },
        // Tertiary Color - #28787e (Medium Teal)
        tertiary: {
          50: '#e6f2f3',
          100: '#b3d9dc',
          200: '#80c0c5',
          300: '#4da7ae',
          400: '#1a8e97',
          500: '#28787e', // Tertiary - Medium Teal
          600: '#206066',
          700: '#18484d',
          800: '#103033',
          900: '#08181a',
        },
        // Accent Color - #005d39 (Forest Green)
        accent: {
          50: '#e0f5ed',
          100: '#b3e0d1',
          200: '#80cbb5',
          300: '#4db699',
          400: '#1aa17d',
          500: '#005d39', // Accent - Forest Green
          600: '#004a2e',
          700: '#003723',
          800: '#002418',
          900: '#00110d',
        },
        // Additional Pastel Colors - Harmonious with teal/green palette
        'pastel-blue': {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          600: '#0c6bb8',
          700: '#08508a',
        },
        'pastel-mint': {
          50: '#e6faf5',
          100: '#b3f0e0',
          200: '#80e6cb',
          300: '#4ddcb6',
          400: '#1ad2a1',
          600: '#0f9b6d',
          700: '#0b7352',
        },
        'pastel-lavender': {
          50: '#f0e6ff',
          100: '#d9b3ff',
          200: '#c280ff',
          300: '#ab4dff',
          400: '#941aff',
          600: '#6b12b8',
          700: '#510d8a',
        },
        'pastel-peach': {
          50: '#fff0e6',
          100: '#ffd9b3',
          200: '#ffc280',
          300: '#ffab4d',
          400: '#ff941a',
          600: '#c26b0c',
          700: '#8a4d08',
        },
        'pastel-sky': {
          50: '#e6f5ff',
          100: '#b3e0ff',
          200: '#80cbff',
          300: '#4db6ff',
          400: '#1aa1ff',
        },
        'pastel-sage': {
          50: '#f0f5e6',
          100: '#d9e0b3',
          200: '#c2cb80',
          300: '#abb64d',
          400: '#94a11a',
          600: '#6b7a12',
          700: '#4d580d',
        },
        // Legacy support
        teal: {
          50: '#e6f5f2',
          100: '#b3e4d6',
          200: '#80d3ba',
          300: '#4dc29e',
          400: '#1ab182',
          500: '#13a581',
          600: '#0f8a6a',
          700: '#0b6f53',
          800: '#0d5a4a',
          900: '#005d39',
        },
        deepTeal: {
          DEFAULT: '#177076',
          50: '#e0f0f0',
          100: '#b3d9d9',
          200: '#80c2c2',
          300: '#4dabab',
          400: '#1a9494',
          500: '#177076',
          600: '#125a5a',
          700: '#0d4444',
          800: '#082e2e',
          900: '#031818',
        },
        forest: {
          DEFAULT: '#005d39',
          50: '#e0f5ed',
          100: '#b3e0d1',
          200: '#80cbb5',
          300: '#4db699',
          400: '#1aa17d',
          500: '#005d39',
          600: '#004a2e',
          700: '#003723',
          800: '#002418',
          900: '#00110d',
        },
        background: {
          DEFAULT: '#F8FAF9',
        },
        // Premium border – attractive teal-sage for cards/sections
        premium: {
          DEFAULT: 'rgba(19,165,129,0.18)',
          hover: 'rgba(19,165,129,0.35)',
          light: 'rgba(19,165,129,0.08)',
        },
        // Best pastel card palette – soft, premium, teal-harmonious (use bg-card-1/2/3)
        card: {
          1: '#f2faf8', // soft mint white
          2: '#e5f4ef', // soft seafoam
          3: '#e6f4f5', // soft aqua
        },
        // Pastel tints for icons (softer than card)
        pastel: {
          icon: '#eef8f5', // icon wrapper default
          iconHover: '#e0f2ec',
        },
        text: {
          DEFAULT: '#1E1E1E',
          muted: '#707070',
        },
        gray: {
          50: '#F8FAF9', // Background
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#a0a0a0',
          500: '#707070', // Muted Gray
          600: '#5a5a5a',
          700: '#444444',
          800: '#2e2e2e',
          900: '#1E1E1E', // Text
        },
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Lato', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        display: ['Playfair Display', 'Merriweather', 'serif'],
        button: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-slower': 'floatSlower 12s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -15px) scale(1.05)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.98)' },
        },
        floatSlower: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-15px, -20px)' },
        },
        gradientShift: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'gradient-premium': 'linear-gradient(135deg, #0f8a6a 0%, #13a581 50%, #177076 100%)',
        'gradient-premium-soft': 'linear-gradient(180deg, rgba(19,165,129,0.06) 0%, rgba(23,112,118,0.04) 100%)',
      },
      boxShadow: {
        'premium': '0 4px 12px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.08)',
        'premium-lg': '0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.1)',
        'premium-soft': '0 2px 8px rgba(0,0,0,0.04)',
        'inner-soft': 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
        'accent': '0 4px 20px rgba(19,165,129,0.25)',
        'accent-lg': '0 12px 32px rgba(19,165,129,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 20px 40px -12px rgba(0,0,0,0.12)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 28px 56px -12px rgba(0,0,0,0.14)',
        'premium-card': '0 2px 8px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)',
        'premium-card-hover': '0 8px 24px rgba(0,0,0,0.06), 0 32px 64px -16px rgba(0,0,0,0.14), 0 0 0 1px rgba(19,165,129,0.08)',
        'card-hover-glow': '0 0 0 2px rgba(19,165,129,0.2), 0 16px 48px -12px rgba(19,165,129,0.12), 0 28px 56px -16px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
