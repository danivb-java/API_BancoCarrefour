module.exports = {
  testEnvironment: 'allure-jest/node',
  testEnvironmentOptions: {
    resultsDir: 'allure-results'
  },
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'junit-report.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' > '
      }
    ]
  ]
};
