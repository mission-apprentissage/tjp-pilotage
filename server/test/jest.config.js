/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  rootDir: "../",

  // Allows jest to resolve relative paths in imports (import { User } from "src/users/core/models/user")
  modulePaths: ["<rootDir>"],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 3,

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/src/**/*.test.ts"],

  // Collect coverage from all .ts and .tsx files in the src directory
  collectCoverageFrom: ["src/**/*.{ts}"],

  // preset: "ts-jest",

  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
