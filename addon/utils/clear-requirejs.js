import Ember from 'ember';

const { getOwner, get } = Ember;

/**
 * Unsee a requirejs module if it exists
 * @param {String} module The requirejs module name
 */
function requireUnsee(module) {
  if (window.requirejs.has(module)) {
      window.requirejs.unsee(module);
  }
}

/**
 * Clears the requirejs cache for a component, checking for both "classic"
 * style components & "pod" style components
 *
 * @param {Object} config The applicaiton config
 * @param {String} componentName The component name being reloaded
 */
export function clearRequirejsCache(config, componentName) {
  const modulePrefix = get(config, 'modulePrefix');
  const podModulePrefix = get(config, 'podModulePrefix') || modulePrefix;

  // Invalidate regular module
  requireUnsee(`${modulePrefix}/components/${componentName}`);
  requireUnsee(`${modulePrefix}/templates/components/${componentName}`);

  // Invalidate pod modules
  requireUnsee(`${podModulePrefix}/components/${componentName}/component`);
  requireUnsee(`${podModulePrefix}/components/${componentName}/template`);
}

/**
 * Clears the requirejs cache for a component, checking for both "classic"
 * style components & "pod" style components
 *
 * @param {Object} component The component that's being reloaded
 * @param {String} componentName The component name being reloaded
 */
export default function (component, componentName) {
  const owner = getOwner(component);
  const config = owner.resolveRegistration('config:environment');
  clearRequirejsCache(config, componentName);
}
