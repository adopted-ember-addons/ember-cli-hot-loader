/* jshint node: true */
'use strict';
var HTMLBarsWrapHelpers = require('./lib/htmlbars/wrap-helpers');

module.exports = {
    name: 'ember-cli-hot-loader',
    serverMiddleware: function (config){
      // If in production, don't add reloader
      if (config.options.environment === 'production') {
        return;
      }
      var lsReloader = require('./lib/hot-reloader')(config.options);
      lsReloader.run();
    },
    setupPreprocessorRegistry: function(type, registry) {
      registry.add('htmlbars-ast-plugin', {
        name: "wrap-helpers",
        plugin: HTMLBarsWrapHelpers
      });
    }
};
