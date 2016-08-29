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

```
note: this project has only been tested with ember 2.4+
```

1) You must use the hbs function with layout in your components (hbs files are not supported at this time)

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    <h1>hello world</h1>
  `
});
```

## Example application

https://github.com/toranb/ember-redux-ddau-example/commit/81d5c4d254605dadf5dbf990138fb9f0a42b3a93
