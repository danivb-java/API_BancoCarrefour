module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: 'reports',
        filename: 'mochawesome.html',
        openReport: false,
        pageTitle: 'API Tests - Banco Carrefour',
        includeFailureMsg: true,
        includeConsoleLog: true
      }
    ]
  ]
};
