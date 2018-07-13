[![Build Status](https://travis-ci.org/toranb/ember-cli-hot-loader.svg?branch=master)](https://travis-ci.org/toranb/ember-cli-hot-loader)

# Ember-cli-hot-loader

An early look at what hot reloading might look like in the ember ecosystem

## Installation

```
ember install ember-cli-hot-loader
```

During installation Ember CLI will prompt you to update the resolver code. This is required for ember-cli-hot-loader to work.
If you have never modified the resolver, you can simply accept the changes or do a diff and update it manually.
The final code should look something like:

```js
import Resolver from 'ember-resolver';
import HotReloadMixin from 'ember-cli-hot-loader/mixins/hot-reload-resolver';

export default Resolver.extend(HotReloadMixin);
```

note: The HotReloadMixin is replaced with an empty Mixin for production/test builds

## How to use this addon

After the ember install simply run `ember serve` as you normally would. Any changes to component JS/HBS files will result in a hot reload (not a full page reload). If you alter a route, service, controller or controller template ember-cli will do a full page reload.

## Excluding components

If you want to exclude any component(s) from hot reloading simply configure them using `excluded`

```javascript
//my-app/config/environment.js
if (environment === 'development') {
  ENV['ember-cli-hot-loader'] = {
    excluded: ['liquid-unless', 'liquid-child']
  }
}
```

## Tagless wrapper component

If you prefer to avoid the extra div that wraps each hot reloaded component configure it with tagless. Note: the tagless configuration does not support components that receive controller actions.

```javascript
//my-app/config/environment.js
if (environment === 'development') {
  ENV['ember-cli-hot-loader'] = {
    tagless: true
  }
}
```

## Example application

An example application that hot reloads styles/components/reducers

https://github.com/toranb/ember-hot-reload-demo


## Supported Types

* ember-cli will hot reload styles for you when using ember-cli 2.3+
* ember-cli-hot-loader will hot reload component JS/HBS changes
* to hot reload another file type, such as reducers you need to first enable it:

```javascript
//my-app/config/environment.js
if (environment === 'development') {
  ENV['ember-cli-hot-loader'] = {
    supportedTypes: ['components', 'reducers']
  }
}
```

Next write a service that will respond to the events `willLiveReload` and `willHotReload`

```javascript
import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  init () {
    this._super(...arguments);
    this.on('willLiveReload', this, 'confirmLiveReload');
    this.on('willHotReload', this, 'attemptHotReload');
  },
  confirmLiveReload(event) {
    const module = getModulePath(event.modulePath);
    if (module) {
      event.cancel = true;
      window.requirejs.unsee(module);
    }
  },
  attemptHotReload(modulePath) {
    const module = getModulePath(modulePath);
    if (module) {
      // re-render, replace module, etc
    }
  }
});
```

## Community Plugins

https://github.com/ember-redux/ember-redux-hot-loader

## Known Compatibility Workarounds

#### Content Security Policy

There is a known issue when used in conjunction with [ember-cli-content-security-policy](https://github.com/rwjblue/ember-cli-content-security-policy) or any strong [Content Security Policy](https://content-security-policy.com/) that blocks `"unsafe-eval"` (as it should).

When this plugin tries to execute the `Ember.HTMLBars.compile` function, a CSP (Content Security Policy) that does not allow `"unsafe-eval"` will block the JS execution with the following error:

```
Uncaught EvalError: Refused to evaluate a string as JavaScript
because 'unsafe-eval' is not an allowed source of script in the
following Content Security Policy directive: "script-src ...
```

To workaround this issue, in the `config/environment.js` file, add `"unsafe-eval"` to the Development and Test environment sections. Do NOT just add `"unsafe-eval"` to the CSP that goes to Production as this will defeat one of the main safeguards that comes from using a CSP. Here is sample code to add to the CSP in the proper environments only:

```
  // config/environment.js
  ENV.contentSecurityPolicy = {
    // normal CSP for Production here
  }

  if (environment === 'development') {
    // ...
    // Allow unsafe eval on dev environment
    ENV.contentSecurityPolicy['script-src'].push("'unsafe-eval'");
  }

  if (environment === 'test') {
    // ...
    // Allow unsafe eval on test environment
    ENV.contentSecurityPolicy['script-src'].push("'unsafe-eval'");
  }
```
