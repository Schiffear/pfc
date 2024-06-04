/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'blood-red': '#8B0000',
          'dark-red': '#5B0000',
          'midnight': '#121063',
        },
        fontFamily: {
          'cormorant': ['Cormorant Garamond', 'serif'],
          'unifraktur': ['UnifrakturMaguntia', 'cursive'],
        },
        backgroundImage: {
          'cthulhu-left': "url('https://lantredecthulhu.com/wp-content/uploads/2016/04/article-qui-est-cthulhu.jpg')",
          'cthulhu-center': "url('https://t4.ftcdn.net/jpg/05/58/54/53/360_F_558545357_OZwyZYPL5i9oiadw9JspOvhOj13OrK7a.jpg')",
          'cthulhu-right': "url('https://t4.ftcdn.net/jpg/05/63/75/53/360_F_563755388_GqRQFKJsFuRCgYb2T5VeZridLj8ZIaZf.jpg')",
        },
        animation: {
          'background-slide': 'background-slide 15s infinite',
        },
        keyframes: {
          'background-slide': {
            '0%, 100%': { backgroundPosition: 'left' },
            '33%': { backgroundPosition: 'center' },
            '66%': { backgroundPosition: 'right' },
          },
        },
      },
    },
    plugins: [],
  }
  