/* jshint node: true */
'use strict';

var path = require('path');
var reloadExtensions = ['js'];
var reloadJsPattern = new RegExp('\.(' + reloadExtensions.join('|') + ')$');

var noop = function(){};

module.exports = function StylesReloader(options){
  var options = options;
  var fsWatcher = options.watcher;
  var ui = options.ui;
  var _isRunning = false;
  var lsProxy = options.ssl ? require('https') : require('http');

  // var appComponentsPath = path.join(options.project.root, 'app', 'components', '*');
  // var appReducersPath = path.join(options.project.root, 'app', 'reducers', '*');
  // var appJSPattern = new RegExp('\.(' + appComponentsPath + '|' appReducersPath + ')$');
  var appJSPath = path.join(options.project.root, 'app', 'components', '*');
  var appJSPattern = new RegExp('^' + appJSPath);
  var appJSResource = options.project.pkg.name + '.js';

  var liveReloadHostname = [
    (options.ssl ? 'https://' :'http://'),
    (options.liveReloadHost || options.host || 'localhost'),
    ':',
    options.liveReloadPort
  ].join('');


  function shouldReload(filePath){
    return filePath.match(reloadJsPattern);
  };

  function getReloadResource(filePath){
    return filePath.match(appJSPattern) ? appJSResource : 'vendor.js';
  };

  function fileDidChange(results){
    var filePath = results.filePath || '';

    ui.writeLine(filePath);

    if (shouldReload(filePath)){
      var reloadResource = getReloadResource(filePath);
      var url;
      ui.writeLine('Reloading ' + filePath + ' only');
      try {
          url = liveReloadHostname + '/changed?files=' + filePath;
          ui.writeLine('GET' + url);
          lsProxy.get(url).on('error', noop);
      } catch(e) {
          ui.writeLine('??what the fuu' + e);
      }
    }
  };

  function mergeReloadFilters(){
    options.project.liveReloadFilterPatterns.push(reloadJsPattern);
  };

  return {

    run: function(){
      if (!options.liveReload) {
        ui.writeLine('JSReloader is disabled');
        return;
      }

      if (this.isRunning()){
        return;
      }

      ui.writeLine('JSReloader watches ' + reloadExtensions.join('|'));
      if (fsWatcher) {
        mergeReloadFilters();
        fsWatcher.on('change', fileDidChange.bind(this));
        _isRunning = !_isRunning;
      }
    },

    isRunning: function(){
      return _isRunning;
    }
  };
};
