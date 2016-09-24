function createPlugin (appName, hotReloadService) {

  function Plugin (window, host) {
    this.window = window;
    this.host = host;
  }
  Plugin.identifier = 'ember-hot-reload';
  Plugin.version = '1.0'; // Just following the example, this might not be even used
  Plugin.prototype.reload = function(path) {
    const cancelableEvent = { modulePath: path, cancel: false};
    hotReloadService.trigger('willLiveReload', cancelableEvent);
    if (cancelableEvent.cancel) {   // Only hotreload if someone canceled the regular reload
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
          hotReloadService.trigger('newChanges', path);
        }, 10);
      };
      script.type = 'text/javascript';
      script.src = `/assets/${appName}.js`;
      document.body.appendChild(script);

      return true;
    }
    return false;
  };
  Plugin.prototype.analyze = function() {
    return {
      disable: false
    };
  };

  return Plugin;
}

export function initialize(appInstance) {
  if (!window.LiveReload) {
    return;
  }
  let appName = appInstance.base.name;
  if (appName === 'ember-cli-hot-loader') {
    // TODO: find a better way to support other addons using the dummy app
    appName = 'dummy';
  }
  const Plugin = createPlugin(appName, appInstance.lookup('service:hot-reload'));
  window.LiveReload.addPlugin(Plugin);
}

export default {
  name: 'hot-loader-livereload-plugin',
  initialize
};
