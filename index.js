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
        app.import(app.bowerDirectory + '/ember/ember-template-compiler.js');
    },
    contentFor: function(type) {
        var environment = this.app.env.toString();
        var appName = this.app.name;
        if (type === 'body-footer') {
            if (environment === 'development') {
                //hack the reloadPage to take path for now*
                //https://github.com/livereload/livereload-js/issues/58
                return "<script>window.LiveReload.reloader.reloadPage = function(path) {" +
                "window.runningTests = true;" +
                "var tags = document.getElementsByTagName('script');" +
                "for (var i = tags.length; i >= 0; i--){" +
                "if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf('" + appName + "') != -1)" +
                "tags[i].parentNode.removeChild(tags[i]);" +
                "}" +
                "var script = document.createElement('script');" +
                "script.onload = function() {" +
                "setTimeout(function() {" +
                "window.runningTests = false;" +
                "window.devtools.service('hot-reload').trigger('newChanges', path);" +
                "}, 10)};" +
                "script.type = 'text/javascript';" +
                "script.src = '/assets/" + appName + ".js';" +
                "document.body.appendChild(script);" +
                "}</script>";
            }
        }
    }
};
