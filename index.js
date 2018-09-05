/* eslint-env node */
'use strict';
var fs = require('fs');
var path = require('path');
var map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-cli-hot-loader',
  serverMiddleware: function (config){
    if (config.options.environment === 'production' || config.options.environment === 'test') {
      return;
    }

    var lsReloader = require('./lib/hot-reloader')(config.options, this.supportedTypes);
    lsReloader.run();
  },
  _getTemplateCompilerPath() {
    var npmCompilerPath = path.join('ember-source', 'dist', 'ember-template-compiler.js');
    return path.relative(this.project.root, require.resolve(npmCompilerPath));
  },
  included: function (app) {
    this._super.included(app);

    if (app.env === 'production' || app.env === 'test') {
      return;
    }

    var config = app.project.config('development');
    var addonConfig = config[this.name] || { supportedTypes: ['components'] };
    this.supportedTypes = addonConfig['supportedTypes'] || ['components'];
    var npmPath = addonConfig['templateCompilerPath'] || this._getTemplateCompilerPath();

    // Require template compiler as in CLI this is only used in build, we need it at runtime
    if (fs.existsSync(npmPath)) {
      app.import(npmPath);
    } else {
      throw new Error('Unable to locate ember-template-compiler.js. ember/ember-source not found in node_modules');
    }
  },

  treeFor(name) {
    if (this.app.env === 'production' || this.app.env === 'test') {
      if (name === 'app' || name === 'addon') {
        const noopResolverMixin = 'define(\'ember-cli-hot-loader/mixins/hot-reload-resolver\', [\'exports\'], function (exports) { \'use strict\'; Object.defineProperty(exports, "__esModule", { value: true }); exports.default = Ember.Mixin.create({}); });';
        const resolverMixin = 'ember-cli-hot-loader/mixins/hot-reload-resolver.js';
        return map(this._super.treeFor.apply(this, arguments), (content, path) => {
          return path === resolverMixin ? noopResolverMixin : content;
        });
      }
      return;
    }
    return this._super.treeFor.apply(this, arguments);
  }
};
