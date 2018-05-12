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

## How to use this addon

After installing it, simply run `ember serve` as usual, any changes you do to supported types, will result in a hotreload (no brower refresh).
Any additional changes will result in a regular liveReload.

## Configurations and Supported Types

* ember-cli will hot reload styles for you when using ember-cli 2.3+
* ember-cli-hot-loader will hot reload component JS/HBS changes
* to hot reload another file type, such as reducers you need to first enable it:

```javascript
//my-app/config/environment.js
ENV['ember-cli-hot-loader'] = {
  supportedTypes: ['components', 'reducers']
}
```

## Example application

An example application that hot reloads styles/components/reducers

https://github.com/toranb/ember-hot-reload-demo
