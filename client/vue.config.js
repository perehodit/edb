const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/utils/*.scss')],
    },
  },
  devServer: {
    proxy: 'http://localhost:3000/',
  },
};
