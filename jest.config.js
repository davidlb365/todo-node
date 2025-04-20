/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  verbose: true,
  // testPathIgnorePatterns: [
  //     "/node_modules/",
  //     "/src/__tests__/auth.test.ts"
  // ]
  // setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};