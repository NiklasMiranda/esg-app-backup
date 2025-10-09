const prefixer = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    prefixer({
      prefix: '#esg-root',
      transform(prefix, selector, prefixedSelector) {
        // Undgå at prefixe html og body
        if (selector.startsWith('html') || selector.startsWith('body')) {
          return selector;
        }
        return prefixedSelector;
      },
    }),
  ],
};
