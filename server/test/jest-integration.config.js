// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("./jest.config");

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  slowTestThreshold: 10,
  testTimeout: 20000,
  verbose: true,
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  globalSetup: "<rootDir>/test/integration-tests-setup.ts",
  globalTeardown: "<rootDir>/test/integration-tests-teardown.ts",
};
