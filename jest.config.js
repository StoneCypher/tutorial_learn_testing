module.exports = {

  testEnvironment            : 'node',

  moduleFileExtensions       : ['js'],
  coveragePathIgnorePatterns : ["/node_modules/", "/src/js/tests/"],
  testMatch                  : ['**/*.spec.js'],

  verbose                    : false,
  collectCoverage            : true,
  coverageDirectory          : "coverage/spec/",

  coverageThreshold : {
    global : {
      branches   : 5,
      functions  : 5,
      lines      : 5,
      statements : 5,
    },
  },

  collectCoverageFrom: ["src/js/**/.js"],

  reporters: [

    ['default',             {}],

    ['jest-json-reporter2', {
      outputDir: './coverage/spec',
      outputFile: 'metrics.json',
      fullOutput: false
    }]

  ]

};
