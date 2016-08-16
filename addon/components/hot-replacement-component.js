import Ember from 'ember';
import HotComponentMixin from 'ember-cli-hot-loader/mixins/hot-component';

const { getOwner } = Ember;

//this function is very pods specific right now - FYI
function matchingComponent (wrappedComponentName, moduleName) {
  if(!wrappedComponentName) {
      return false;
  }
  var unwrappedComponentName = wrappedComponentName.replace(/-original$/, '');
  var filePathArray = moduleName.split('/');
  var componentName = filePathArray[filePathArray.length - 2];
  return unwrappedComponentName.indexOf(componentName) > -1;
}

function clearCache (wrapper) {
  const name = `component:${wrapper.get('wrappedComponentName')}`;
  const owner = getOwner(wrapper);
  owner.__container__.cache[name] = undefined;
  owner.__container__.factoryCache[name] = undefined;
  owner.__registry__._resolveCache[name] = undefined;
  owner.__registry__._failCache[name] = undefined;

  owner.base.__container__.cache[name] = undefined;
  owner.base.__container__.factoryCache[name] = undefined;
  owner.base.__registry__._resolveCache[name] = undefined;
  owner.base.__registry__._failCache[name] = undefined;
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

  __rerenderOnTemplateUpdate (moduleName) {
      var wrappedComponentName = this.get('wrappedComponentName');
      if(matchingComponent(wrappedComponentName, moduleName)) {
          this._super(...arguments);
          clearCache(this);
          this.set('wrappedComponentName', undefined);
          this.rerender();
          Ember.run.later(()=> {
            this.set('wrappedComponentName', wrappedComponentName);
          });
      }
  }
});

HotReplacementComponent.reopenClass({
  createClass(OriginalComponentClass, parsedName) {
    const NewComponentClass = HotReplacementComponent.extend({
      wrappedComponentName: parsedName.fullNameWithoutType + '-original'
    });
    NewComponentClass.reopenClass({
      positionalParams: OriginalComponentClass.positionalParams ? OriginalComponentClass.positionalParams.slice() : []
    });
    return NewComponentClass;
  }
});
export default HotReplacementComponent;
