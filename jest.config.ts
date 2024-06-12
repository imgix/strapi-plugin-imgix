import type { JestConfigWithTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const config: JestConfigWithTsJest = {
  testMatch: ['**/__tests__/?(*.)+(spec|test).(t|j)s'],
  transform: {
    ...tsjPreset.transform,
    '^.+\\.tsx?$': [
      'ts-jest',
      {//the content you'd placed at "global"
        diagnostics: false,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  preset: 'ts-jest',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  globals: {
  },
};

export default config;
