// jest.config.js

module.exports = {
    preset: 'ts-jest', // Use ts-jest for TypeScript support
    testEnvironment: 'jsdom', // Use jsdom as the test environment
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/src/components/$1', // Adjust based on your project structure
        '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1'
    },
    testMatch: ['**/tests/**/*.test.ts'], // Adjust to match your test file naming convention
    collectCoverage: true, // Optional: Enables test coverage collection
    coverageReporters: ['lcov', 'text', 'html'], // Optional: Report formats for coverage
};
