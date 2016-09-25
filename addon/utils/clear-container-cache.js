import getOwner from 'ember-getowner-polyfill';

function clear (context, owner, name) {
  if (owner.__container__) {
    owner.__container__.cache[name] = undefined;
    owner.__container__.factoryCache[name] = undefined;
    owner.__registry__._resolveCache[name] = undefined;
    owner.__registry__._failCache[name] = undefined;

    owner.base.__container__.cache[name] = undefined;
    owner.base.__container__.factoryCache[name] = undefined;
    owner.base.__registry__._resolveCache[name] = undefined;
    owner.base.__registry__._failCache[name] = undefined;
  } else {
    context.container.cache[name] = undefined;
    context.container.factoryCache[name] = undefined;
    context.container._registry._resolveCache[name] = undefined;
    context.container._registry._failCache[name] = undefined;
    // NOTE: the app's __container__ is the same as context.container. Not needed:
    // window.Dummy.__container__.cache[name] = undefined;
    // window.Dummy.__container__.factoryCache[name] = undefined;
    // NOTE: the app's registry, is different than container._registry. We may need this
    // window.Dummy.registry._resolveCache[name] = undefined;
    // window.Dummy.registry._failCache[name] = undefined;
  }
}

export default function clearContainerCache(context, componentName) {
  const componentFullName = `component:${componentName}`;
  const templateFullName = `template:components/${componentName}`;
  const owner = getOwner(context);

  clear(context, owner, componentFullName);
  clear(context, owner, templateFullName);
}
