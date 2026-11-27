const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootExport = require.resolve('govuk-frontend');
const root = path.resolve(rootExport, '..');
const components = path.resolve(root, 'components');
const assets = path.resolve(root, 'assets');
const images = path.resolve(assets, 'images');
const fonts = path.resolve(assets, 'fonts');

const copyGovukTemplateAssets = new CopyWebpackPlugin({
  patterns: [
    { from: images, to: 'assets/images' },
    { from: fonts, to: 'assets/fonts' },
    { from: `${assets}/manifest.json`, to: 'assets/manifest.json' },
  ],
});

module.exports = {
  paths: { template: root, components, assets },
  plugins: [copyGovukTemplateAssets],
};
