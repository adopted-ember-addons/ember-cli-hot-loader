import Ember from 'ember';
import HotComponentMixin from 'ember-cli-hot-loader/mixins/hot-component';

import clearCache from 'ember-cli-hot-loader/utils/clear-container-cache';
import clearRequirejs from 'ember-cli-hot-loader/utils/clear-requirejs';

function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // eslint-disable-line
}

export function matchesPodConvention (componentName, modulePath) {
  var basePath = 'components/' + componentName;
  var componentRegexp = new RegExp(regexEscape(basePath + '/component.js') + '$');
  if (componentRegexp.test(modulePath)) {
    return true;
  }

  var templateRegex = new RegExp(regexEscape(basePath + '/template.hbs') + '$');
  if (templateRegex.test(modulePath)) {
    return true;
  }

  return false;
}

export function matchesClassicConvention (componentName, modulePath) {
  var componentRegexp = new RegExp(regexEscape('components/' + componentName + '.js') + '$');
  if (componentRegexp.test(modulePath)) {
    return true;
  }

  var templateRegexp = new RegExp(regexEscape('templates/components/' + componentName + '.hbs') + '$');
  if (templateRegexp.test(modulePath)) {
    return true;
  }

  return false;
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

function getPositionalParamsArray (constructor) {
  const positionalParams = constructor.positionalParams;
  return typeof(positionalParams) === 'string' ?
    [positionalParams] :
    positionalParams;
}

const HotReplacementComponent = Ember.Component.extend(HotComponentMixin, {
  parsedName: null,
  tagName: '',
  layout: Ember.computed(function () {
    let positionalParams = getPositionalParamsArray(this.constructor).join('');
    const attributesMap = Object.keys(this.attrs)
      .filter(key => positionalParams.indexOf(key) === -1)
      .map(key =>`${key}=${key}`).join(' ');
    return Ember.HTMLBars.compile(`
      {{#if hasBlock}}
        {{#if (hasBlock "inverse")}}
          {{#component wrappedComponentName ${positionalParams} ${attributesMap} target=_targetObject as |a b c d e f g h i j k|}}
            {{yield a b c d e f g h i j k}}
          {{else}}
            {{yield to="inverse"}}
          {{/component}}
        {{else}}
          {{#component wrappedComponentName ${positionalParams} ${attributesMap} target=_targetObject as |a b c d e f g h i j k|}}
            {{yield a b c d e f g h i j k}}
          {{/component}}
        {{/if}}
      {{else}}
        {{component wrappedComponentName ${positionalParams} ${attributesMap} target=_targetObject}}
      {{/if}}
    `);
  }).volatile(),

  __willLiveReload (event) {
    const baseComponentName = this.get('baseComponentName');
    if (matchingComponent(baseComponentName, event.modulePath)) {
      event.cancel = true;
      clearRequirejs(this, baseComponentName);
    }
  },
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
