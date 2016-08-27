/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-cli-hot-loader',
    serverMiddleware: function(config){
        var lsReloader = require('./lib/hot-reloader')(config.options);
        lsReloader.run();
    },
    included (app) {
        this._super.included(app);
        // TODO: consider removing this since it adds an unnecessary runtime dependency to all apps
        app.import(app.bowerDirectory + '/ember/ember-template-compiler.js');
    },
    isDevelopingAddon () {
      return true;
    },
    contentFor: function(type, config) {
        var environment = this.app.env.toString();
        var appName = this.app.name;
        if (type === 'body-footer') {
            // TODO: find a better place other than body-footer or add a file instead of inline
            if (environment === 'development') {
                //hack the reloadPage to take path for now*
                //https://github.com/livereload/livereload-js/issues/58
                return '<script id="ember-cli-hot-loader-plugin" data-app-name="' + appName + '" src="' + config.rootURL + 'ember-cli-hot-loader/livereload-plugin.js"></script>';
            }
        }
    }
};
