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
    }
};
