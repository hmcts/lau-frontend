const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const root = path.resolve(__dirname, './../');
const assets = path.resolve(root, './src/main/assets');

const copyLookAndFeelAssets = new CopyWebpackPlugin({
  patterns: [
    { from: `${assets}/pdfs/Excel import - How-To.pdf`, to: 'assets/pdfs/Excel import - How-To.pdf' },
    { from: `${assets}/pdfs/User Guide - Challenged and Specific Access.pdf`, to: 'assets/pdfs/User Guide - Challenged and Specific Access.pdf' },
  ],
});

module.exports = {
  plugins: [ copyLookAndFeelAssets ],
};
