import Ember from 'ember';

const { getOwner } = Ember;

var templateOptionsKey = null;
var templateCompilerKey = null;

function clearIfHasProperty (obj, propertyName) {
  if (obj && Object.hasOwnProperty.call(obj, propertyName)) {
    obj[propertyName] = undefined;
  }
}

function clear (context, owner, name) {
  var environment = owner.lookup('service:-glimmer-environment');
  if (environment) { // Glimmer2
    environment._definitionCache && environment._definitionCache.store && environment._definitionCache.store.clear();
  }
  if (templateOptionsKey) { // Ember v3.1.1
    var templateOptions = owner.lookup(templateOptionsKey);
    var optionsTimeLookup = templateOptions.resolver;
    var optionsRuntimeResolver = optionsTimeLookup.resolver;
    optionsRuntimeResolver.componentDefinitionCache.clear();
  }
  if (templateCompilerKey) { // Ember v3.2
    var templateCompiler = owner.lookup(templateCompilerKey);
    var compileTimeLookup = templateCompiler.resolver;
    var compileRuntimeResolver = compileTimeLookup.resolver;
    compileRuntimeResolver.componentDefinitionCache.clear();
  }
  if (owner.__container__) {
    clearIfHasProperty(owner.__container__.cache, name);
    clearIfHasProperty(owner.__container__.factoryCache, name);
    clearIfHasProperty(owner.__container__.factoryManagerCache, name);
    clearIfHasProperty(owner.__registry__._resolveCache, name);
    clearIfHasProperty(owner.__registry__._failCache, name);

    clearIfHasProperty(owner.base.__container__.cache, name);
    clearIfHasProperty(owner.base.__container__.factoryCache, name);
    clearIfHasProperty(owner.base.__container__.factoryManagerCache, name);
    clearIfHasProperty(owner.base.__registry__._resolveCache, name);
    clearIfHasProperty(owner.base.__registry__._failCache, name);
  } else {
    clearIfHasProperty(context.container.cache, name);
    clearIfHasProperty(context.container.factoryCache, name);
    clearIfHasProperty(context.container.factoryManagerCache, name);
    clearIfHasProperty(context.container._registry._resolveCache, name);
    clearIfHasProperty(context.container._registry._failCache, name);
    // NOTE: the app's __container__ is the same as context.container. Not needed:
    // clearIfHasProperty(window.Dummy.__container__.cache, name);
    // clearIfHasProperty(window.Dummy.__container__.factoryCache, name);
    // NOTE: the app's registry, is different than container._registry. We may need this
    // clearIfHasProperty(window.Dummy.registry._resolveCache, name);
    // clearIfHasProperty(window.Dummy.registry._failCache, name);
  }
}

var optionsRegex = new RegExp('template-options:main-(.*)');
var compilerRegex = new RegExp('template-compiler:main-(.*)');
export function captureTemplateOptions(parsedName) {
  if (templateCompilerKey || templateOptionsKey) {
    return;
  }
  var name = parsedName.fullName || '';
  var optionsMatch = name.match(optionsRegex);
  if (optionsMatch && optionsMatch.length > 0) {
    templateOptionsKey = name;
  }
  var compilerMatch = name.match(compilerRegex);
  if (compilerMatch && compilerMatch.length > 0) {
    templateCompilerKey = name;
  }
}

export default function clearContainerCache(context, componentName) {
  const componentFullName = `component:${componentName}`;
  const templateFullName = `template:components/${componentName}`;
  const owner = getOwner(context);

  clear(context, owner, componentFullName);
  clear(context, owner, templateFullName);
}
