/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-cli-hot-loader',
    serverMiddleware: function (config){
	// If in production, don't add reloader
        if (config.options.environment === 'production') {
            return;
        }
        var lsReloader = require('./lib/hot-reloader')(config.options);
        lsReloader.run();
    }
};
