import { getOwner } from '@ember/application';

var templateOptionsKey = null;
var templateCompilerKey = null;

function clearIfHasProperty (obj, propertyName) {
  if (obj && Object.hasOwnProperty.call(obj, propertyName)) {
    obj[propertyName] = undefined;
  }
}

function clear (context, owner, name) {
  if (templateCompilerKey) { // Ember v3.2
    var templateCompiler = owner.lookup(templateCompilerKey);
    var compileTimeLookup = templateCompiler.resolver;
    var compileRuntimeResolver = compileTimeLookup.resolver;
    compileRuntimeResolver.componentDefinitionCache.clear();
  } else if (templateOptionsKey) { // Ember v3.1.1
    var templateOptions = owner.lookup(templateOptionsKey);
    var optionsTimeLookup = templateOptions.resolver;
    var optionsRuntimeResolver = optionsTimeLookup.resolver;
    optionsRuntimeResolver.componentDefinitionCache.clear();
  } else {
    var environment = owner.lookup('service:-glimmer-environment');
    if (environment) {
      environment._definitionCache && environment._definitionCache.store && environment._definitionCache.store.clear();
    }
  }

  if (owner.__container__) {
    clearIfHasProperty(owner.base.__container__.cache, name);
    clearIfHasProperty(owner.base.__container__.factoryCache, name);
    clearIfHasProperty(owner.base.__container__.factoryManagerCache, name);
    clearIfHasProperty(owner.base.__registry__._resolveCache, name);
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
