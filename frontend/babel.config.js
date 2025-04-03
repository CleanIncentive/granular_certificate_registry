const path = require('path');

module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@components': './src/components',
        '@pages': './src/pages',
        '@utils': './src/utils',
        '@services': './src/services',
        '@store': './src/store'
      }
    }]
  ],
}; 