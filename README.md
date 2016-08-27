# Ember-cli-hot-loader

An early look at what hot reloading might look like in the ember ecosystem

## Installation

```
ember install toranb/ember-cli-hot-loader
```

During installation Ember CLI will prompt you to update the resolver code. This is required for ember-cli-hot-loader to work. 
If you have never modified the resolver, you can simply accept the changes or do a diff and update it manually. 
The final code should look something like:

```js
import Resolver from 'ember-resolver';
import HotReloadMixin from 'ember-cli-hot-loader/mixins/hot-reload-resolver';

export default Resolver.extend(HotReloadMixin);
```

Add the development settings for ember-devtools to your config/environment.js

```js
'ember-devtools': {
  global: 'devtools',
  enabled: environment === 'development'
}
```

## How to use this addon

1) Your app must be using pods

```
note: this project has only been tested with ember 2.4+
```

2) You must use the hbs function with layout in your components (hbs files are not supported at this time)

```js
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    <h1>hello world</h1>
  `
});
```

3) Update the livereload.js file in `node_modules` by adding `path` as an argument to the line `return this.reloadPage();`

```
vim node_modules/ember-cli/node_modules/tiny-lr/node_modules/livereload-js/dist/livereload.js
```

Until the livereload issue below is resolved you will need to hack the reloadPage function to provide path

```
return this.reloadPage(path);
```

https://github.com/livereload/livereload-js/issues/58

## Example application

https://github.com/toranb/ember-redux-ddau-example/commit/8e52c51bbfef8802d5485cd83c140090fb7cba0f
