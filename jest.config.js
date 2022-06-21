const { defaults } = require('jest-config'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'd.ts'],
  verbose: true,
  transform: { '^.+\\.tsx?$': 'ts-jest/legacy' },
};
