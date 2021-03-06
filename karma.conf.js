'use strict';
var istanbul = require("browserify-istanbul");
module.exports = function(karma) {
  karma.set({

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'test/**/*.js'
    ],

    reporters: [ 'mocha'],

    preprocessors: {
      'test/**/*.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      extension: [".js"]
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_DEBUG',

    singleRun: false,
    autoWatch: true,
    
    browserNoActivityTimeout: 100000,
    browserDisconnectTimeout: 100000,
    browserDisconnectTolerance: 100000
    // browserify configuration
  });
};
