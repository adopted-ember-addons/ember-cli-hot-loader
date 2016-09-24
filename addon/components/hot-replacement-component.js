import Ember from 'ember';
import HotComponentMixin from 'ember-cli-hot-loader/mixins/hot-component';

const { getOwner } = Ember;

export function matchesPodConvention (componentName, modulePath) {
  var filePathArray = modulePath.split('/');
  var type = filePathArray[filePathArray.length - 3];
  var componentNameFromPath = filePathArray[filePathArray.length - 2];
  var fileName = filePathArray[filePathArray.length - 1];
  return type === 'components' && componentName === componentNameFromPath && (fileName === 'component.js' || fileName === 'template.hbs');
}
export function matchesClassicConvention (componentName, modulePath) {
  var filePathArray = modulePath.split('/');
  var type = filePathArray[filePathArray.length - 2];
  var componentNameFromPath = filePathArray[filePathArray.length - 1].replace(/.js$|.hbs$/, '');
  return type === 'components' && componentName === componentNameFromPath;
}
function matchingComponent (componentName, modulePath) {
  if(!componentName) {
      return false;
  }
  // For now we only support standard conventions, later we may have a better
  // way to learn from resolver resolutions
  return matchesClassicConvention(componentName, modulePath) ||
    matchesPodConvention(componentName, modulePath);
}

function clearCache (context, componentName) {
  const componentFullName = `component:${componentName}`;
  const templateFullName = `template:components/${componentName}`;
  const owner = getOwner(context);
  function clear (name) {
    owner.__container__.cache[name] = undefined;
    owner.__container__.factoryCache[name] = undefined;
    owner.__registry__._resolveCache[name] = undefined;
    owner.__registry__._failCache[name] = undefined;

    owner.base.__container__.cache[name] = undefined;
    owner.base.__container__.factoryCache[name] = undefined;
    owner.base.__registry__._resolveCache[name] = undefined;
    owner.base.__registry__._failCache[name] = undefined;
  }
  clear(componentFullName);
  clear(templateFullName);
}

const HotReplacementComponent = Ember.Component.extend(HotComponentMixin, {
  parsedName: null,
  tagName: '',
  layout: Ember.computed(function () {
    const positionalParams = this.constructor.positionalParams;
    const attributesMap = Object.keys(this.attrs)
      .filter(key => positionalParams.indexOf(key) === -1)
      .map(key =>`${key}=${key}`).join(' ');
    return Ember.HTMLBars.compile(`
      {{#if hasBlock}}
        {{#if (hasBlock "inverse")}}
          {{#component wrappedComponentName ${positionalParams.join(' ')} ${attributesMap} as |a b c d e f g h i j k|}}
            {{yield a b c d e f g h i j k}}
          {{else}}
            {{yield to="inverse"}}
          {{/component}}
        {{else}}
          {{#component wrappedComponentName ${positionalParams.join(' ')} ${attributesMap} as |a b c d e f g h i j k|}}
            {{yield a b c d e f g h i j k}}
          {{/component}}
        {{/if}}
      {{else}}
        {{component wrappedComponentName ${positionalParams.join(' ')} ${attributesMap}}}
      {{/if}}
    `);
  }).volatile(),

  __rerenderOnTemplateUpdate (modulePath) {
      const baseComponentName = this.get('baseComponentName');
      const wrappedComponentName = this.get('wrappedComponentName');
      if(matchingComponent(baseComponentName, modulePath)) {
          this._super(...arguments);
          clearCache(this, baseComponentName);
          clearCache(this, wrappedComponentName);
          this.setProperties({
            wrappedComponentName: undefined,
            baseComponentName: undefined
          });
          this.rerender();
          Ember.run.later(()=> {
            this.setProperties({
              wrappedComponentName: wrappedComponentName,
              baseComponentName: baseComponentName
            });
          });
      }
  }
});

HotReplacementComponent.reopenClass({
  createClass(OriginalComponentClass, parsedName) {
    const NewComponentClass = HotReplacementComponent.extend({
      baseComponentName: parsedName.fullNameWithoutType,
      wrappedComponentName: parsedName.fullNameWithoutType + '-original'
    });
    NewComponentClass.reopenClass({
      positionalParams: OriginalComponentClass.positionalParams ? OriginalComponentClass.positionalParams.slice() : []
    });
    return NewComponentClass;
  }
});
export default HotReplacementComponent;
