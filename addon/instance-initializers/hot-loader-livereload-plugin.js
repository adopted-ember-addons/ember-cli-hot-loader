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
      // Reloading app.js will fire Application.create unless we set this.
      // TODO: make sure this doesn't break tests
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

function lookup (appInstance, fullName) {
  if (appInstance.lookup) {
    return appInstance.lookup(fullName);
  }
  return appInstance.application.__container__.lookup(fullName);
}

function getAppName (appInstance) {
  if (appInstance.base) {
    return appInstance.base.name;
  }
  // TODO: would this work in 2.4+?
  return appInstance.application.name;
}

export function initialize(appInstance) {
  if (!window.LiveReload) {
    return;
  }
  let appName = getAppName(appInstance);
  if (appName === 'ember-cli-hot-loader') {
    // TODO: find a better way to support other addons using the dummy app
    appName = 'dummy';
  }
  const Plugin = createPlugin(appName, lookup(appInstance, 'service:hot-reload'));
  window.LiveReload.addPlugin(Plugin);
}

export default {
  name: 'hot-loader-livereload-plugin',
  initialize
};
