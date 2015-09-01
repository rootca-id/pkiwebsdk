'use strict';
var istanbul = require("browserify-istanbul");
module.exports = function(karma) {
  karma.set({

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'src/index.js',
      'test/**/*.js'
    ],

    reporters: [ 'mocha', "coverage"],

    preprocessors: {
      'src/index.js': [ 'browserify' ],
      'test/**/*.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      /* transform : [istanbul({"ignore" : ["lib/**"]})], */
      extension: [".js"]
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_DEBUG',

    singleRun: false,
    autoWatch: true,
    
    coverageReporter : {
      type: "html",
      dir : "coverage/"
    },

    // browserify configuration
  });
};
