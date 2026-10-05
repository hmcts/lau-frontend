module.exports = {
  roots: ['<rootDir>/src/test/a11y'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(mts|ts|js)$",
  "testEnvironment": "node",
  extensionsToTreatAsEsm: ['.mts'],
  transform: {
    '^.+\\.mts$': ['ts-jest', { useESM: true, tsconfig: { module: 'NodeNext', moduleResolution: 'NodeNext', isolatedModules: true } }],
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['mts', 'ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
