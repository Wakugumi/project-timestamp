import type {Config} from '@jest/types';
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@utility/(.*)$': '<rootDir>/src/utility/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  }
};
export default config;