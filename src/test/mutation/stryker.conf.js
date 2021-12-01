module.exports = {
  tsconfigFile: 'tsconfig.json',
  reporters:
    [
      'clear-text',
      'progress',
      'html',
    ],
  htmlReporter: {baseDir: 'functional-output/mutation-assets'},
  coverageAnalysis: 'perTest',
  mutate:
    [
      'src/main/domain/**.ts',
      'src/main/routes/**.ts',
      'src/main/service/**.ts',
    ],
  ignorePatterns: [
    '**',
    '!config/**',
    '!src/main/**',
    '!src/test/**',
    '!jest.config.js',
  ],
  testRunner: 'jest',
  jest: {
    'configFile': 'jest.config.js',
    'enableFindRelatedTests': true,
  },
  logLevel: 'debug',
};
