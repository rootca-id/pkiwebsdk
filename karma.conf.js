'use strict';

module.exports = function(karma) {
  karma.set({

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'test/**/*.js'
    ],

    reporters: [ 'dots' ],

    preprocessors: {
      'test/**/*.js': [ 'browserify' ]
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_DEBUG',

    singleRun: false,
    autoWatch: false,

    // browserify configuration
    browserify: {
      debug: true,
      transform: [ 'brfs', 'browserify-shim' ]
    }
  });
};
