[![Build Status](https://travis-ci.org/toranb/ember-cli-hot-loader.svg?branch=master)](https://travis-ci.org/toranb/ember-cli-hot-loader)

# Ember-cli-hot-loader

An early look at what hot reloading might look like in the ember ecosystem

## Installation

```
ember install ember-cli-hot-loader
```

### Upgrade

If you were using 0.1.1 or prior, you will need to remove any references 
to `ember-cli-hot-loader/mixins/hot-reload-resolver`, since it's no
longer required. 

## How to use this addon

After installing it, simply run `ember serve` as usual, any changes you do to supported types, will result in a hotreload (no brower refresh). 
Any additional changes will result in a regular liveReload. 

### Supported Types

At the moment, we only hotreload on component and its templates. 
[ember-cli-styles-reloader](https://www.npmjs.com/package/ember-cli-styles-reloader) will do the styles for you. For support for other 
types you can follow https://github.com/toranb/ember-cli-hot-loader/issues/6 
or help us implement some of those. 

## Example application

To see this in action, you can clone this repo and run `ember serve`. 
