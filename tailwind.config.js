/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./partials/**/*.hbs",
    "./templates/**/*.hbs",
    "./src/**/*.js",
    "./src/**/*.ts",
  ],
  theme: {
    container: {
      center: true,
    },
    colors: {
      'transparent': 'transparent',
      'white': '#ffffff',
      'black': '#000000',
      'darkgrey': '#333',
      'red': '#da261b',
      'red_tint': '#e07670',
      'lightBorder': '#525252',
      'darkBorder': '#3D3935',
      'lightgrey': '#f4f4f4',
      'footerbg': '#f8f8f8',
      'lightbg': '#ededed'    
    },

    fontFamily: {
      'universpro': ['"Univers LT Pro", Georgia, Arial, sans-serif'],
      'modernlinetail': ['"modernline tail", Georgia, Arial, sans-serif'],
      'modernline': ['"modernline - Personal Use", Georgia, Arial, sans-serif'],
      'bison': ['"Bison", Georgia, Arial, sans-serif'],
    },
    extend: {
      backgroundImage: {
        'searchIcon': "url('images/search.svg')",
        'userIcon': "url('images/user.svg')",
        'cartIcon': "url('images/bag.svg')",
        'pinIcon': "url('images/pin.svg')",
        'filterIcon': "url('images/filters.svg')",
        'closeIcon': "url('images/close.svg')",
        'menuIcon': "url('images/menu.svg')",
        'locationIcon': "url('images/location.svg')",
        'plusIcon': "url('images/plus.svg')",
        'minusIcon': "url('images/minus.svg')",
        'phoneIcon': "url('images/phone.svg')",
        'rightIcon': "url('images/right.svg')",
        'leftIcon': "url('images/left.svg')",
        'mid-bg': "url('images/mid-bg.jpg')",
        'mid-icon1': "url('images/icon-mid1.svg')",
        'mid-icon2': "url('images/icon-mid2.svg')",
        'abstra-bg': "url('images/absrt-bg.svg')",

        
      }
    },
    
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
};
