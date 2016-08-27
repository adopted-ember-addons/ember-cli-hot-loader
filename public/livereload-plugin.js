(function () {
  if (!window.LiveReload) {
    return;
  }
  var appName = document.getElementById('ember-cli-hot-loader-plugin').getAttribute('data-app-name');
  function Plugin (window, host) {
    this.window = window;
    this.host = host;
  };
  Plugin.identifier = 'ember-hot-reload';
  Plugin.version = '1.0'; // Just following the example, this might not be even used
  Plugin.prototype.reload = function(path, options) {
        // TODO: is this needed? Consider removing since it might have undersired effects
    window.runningTests = true;
    var tags = document.getElementsByTagName('script');
    for (var i = tags.length; i >= 0; i--){
      if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf(appName) !== -1) {
        tags[i].parentNode.removeChild(tags[i]);
      }
    }
    var script = document.createElement('script');
    script.onload = function() {
      setTimeout(function() {
        window.runningTests = false;
        window.devtools.service('hot-reload').trigger('newChanges', path);
      }, 10);
    };
    script.type = 'text/javascript';
    script.src = '/assets/' + appName + '.js';
    document.body.appendChild(script);

    return true;
  };
  Plugin.prototype.analyze = function() {
    return {
      disable: false
    };
  };
  window.LiveReload.addPlugin(Plugin);
})();
