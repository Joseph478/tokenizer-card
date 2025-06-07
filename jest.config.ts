import type { Config } from 'jest';

const config: Config = {
    rootDir: '.',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/infrastructure/repository/*',
        '!src/**/infrastructure/repository/**/*'
    ],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testMatch: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.steps.ts',
    ],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    // Agregar esta línea para setup
    setupFiles: ['<rootDir>/test/jest.setup.ts'],
};

export default config;