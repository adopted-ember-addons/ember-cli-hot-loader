import Ember from 'ember';

const { getOwner, get } = Ember;

// Access requirejs global
const requirejs = window.requirejs;

/**
 * Unsee a requirejs module if it exists
 * @param {String} module The requirejs module name
 */
function requireUnsee(module) {
  if (requirejs.has(module)) {
    requirejs.unsee(module);
  }
}

export default function clearContainerCache(context, componentName) {
  const owner = getOwner(context);
  const config = owner.resolveRegistration('config:environment');
  const appName = get(owner, 'base.name') || get(owner, 'application.name');
  const modulePrefix = get(config, 'modulePrefix') || appName;
  const podModulePrefix = get(config, 'podModulePrefix') || modulePrefix;

  // Invalidate regular module
  requireUnsee(`${modulePrefix}/components/${componentName}`);
  requireUnsee(`${modulePrefix}/templates/components/${componentName}`);

  // Invalidate pod modules
  requireUnsee(`${podModulePrefix}/components/${componentName}/component`);
  requireUnsee(`${podModulePrefix}/components/${componentName}/template`);
}
