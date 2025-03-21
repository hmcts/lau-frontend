module.exports = {
  roots: ['<rootDir>/src/test/unit'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
  "testEnvironment": "node",
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testTimeout: 10000, // Increase the timeout to 10000 ms (10 seconds)
}
