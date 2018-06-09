/* eslint-env node */
'use strict';
var fs = require('fs');
var path = require('path');

module.exports = {
  name: 'ember-cli-hot-loader',
  serverMiddleware: function (config){
    if (config.options.environment === 'production' || config.options.environment === 'test') {
      return;
    }

    var lsReloader = require('./lib/hot-reloader')(config.options, this.supportedTypes);
    lsReloader.run();
  },
  included: function (app) {
    this._super.included(app);

    if (app.env === 'production' || app.env === 'test') {
      return;
    }

    var config = app.project.config('development');
    var addonConfig = config[this.name] || { supportedTypes: ['components'] };
    this.supportedTypes = addonConfig['supportedTypes'];

    var bowerPath = path.join(app.bowerDirectory, 'ember', 'ember-template-compiler.js');
    var npmCompilerPath = path.join('ember-source', 'dist', 'ember-template-compiler.js');
    var npmPath = require.resolve(npmCompilerPath);

    // Require template compiler as in CLI this is only used in build, we need it at runtime
    if (fs.existsSync(bowerPath)) {
      app.import(bowerPath);
    } else if (fs.existsSync(npmPath)) {
      app.import(npmPath);
    } else {
      throw new Error('Unable to locate ember-template-compiler.js. ember/ember-source not found in either bower_components or node_modules');
    }
  }
};
