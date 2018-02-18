/* eslint-env node */
'use strict';
var fs = require('fs');

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
    included: function (app) {
        this._super.included(app);

        // If in production, don't add ember-template-compiler
        if (app.env === 'production') {
            return;
        }

        var bowerPath = app.bowerDirectory + '/ember/ember-template-compiler.js';
        var npmPath = require.resolve('ember-source/dist/ember-template-compiler.js');

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
