const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const packageJson = require.resolve('flatpickr/package.json');
const root = path.resolve(packageJson, '..', 'dist');
const css = path.resolve(root, 'flatpickr.min.css');
const javascript = path.resolve(root, 'flatpickr.min.js');

const copyFlatpickrAssets = new CopyWebpackPlugin({
  patterns: [
    { from: javascript, to: 'assets/js' },
    { from: css, to: 'assets/css' },
  ],
});

module.exports = {
  plugins: [copyFlatpickrAssets],
};
