/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-cli-hot-loader',
    serverMiddleware: function (config){
        if (config.options.environment === 'development') {
            var lsReloader = require('./lib/hot-reloader')(config.options);
            lsReloader.run();
        }
    },
    included: function (app) {
        this._super.included(app);

        // If not in dev, bail
        if (app.env !== 'development') {
            return;
        }

        const bowerPath = app.bowerDirectory + '/ember/ember-template-compiler.js';
        const npmPath = app.project.nodeModulesPath + '/ember-source/dist/ember-template-compiler.js';

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
