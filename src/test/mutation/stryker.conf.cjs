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
    '!jest.config.cjs',
    '!jest.setup.cjs',
  ],
  testRunner: 'jest',
  jest: {
    'configFile': 'jest.config.cjs',
    'enableFindRelatedTests': true,
  },
  plugins: ['@stryker-mutator/jest-runner'],
  logLevel: 'debug',
  ignoreStatic: true,
};
