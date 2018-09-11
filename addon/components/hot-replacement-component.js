import Ember from 'ember';
import { later } from '@ember/runloop';
import Component from '@ember/component';
import { computed } from '@ember/object';
import HotComponentMixin from 'ember-cli-hot-loader/mixins/hot-component';
import config from 'ember-get-config';

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

export function matchingComponent (componentName, modulePath) {
  if(!componentName) {
      return false;
  }
  var standardModulePath = modulePath.split('\\').join('/');
  var javascriptPath = standardModulePath.replace(/\.ts$/, '.js');
  return matchesClassicConvention(componentName, javascriptPath) ||
    matchesPodConvention(componentName, javascriptPath);
}

function getPositionalParamsArray (constructor) {
  const positionalParams = constructor.positionalParams;
  return typeof(positionalParams) === 'string' ?
    [positionalParams] :
    positionalParams;
}

const HotReplacementComponent = Component.extend(HotComponentMixin, {
  init() {
    const configuration = config['ember-cli-hot-loader'];
    const tagless = configuration && configuration['tagless'];
    const tagName = tagless ? '' : 'div';
    this.set('tagName', tagName);
    return this._super();
  },
  parsedName: null,
  layout: computed(function () {
    let positionalParams = getPositionalParamsArray(this.constructor).join('');
    let attrs = this.attrs || {};
    const attributesMap = Object.keys(attrs)
      .filter(key => positionalParams.indexOf(key) === -1)
      .map(key =>`${key}=${key}`).join(' ');
    return Ember.HTMLBars.compile(`
      {{#if hasBlock}}
        {{#if (hasBlock "inverse")}}
          {{#component wrappedComponentName ${positionalParams} ${attributesMap} target=target as |a b c d e f g h i j k|}}
            {{yield a b c d e f g h i j k}}
          {{else}}
            {{yield to="inverse"}}
          {{/component}}
        {{else}}
          {{#component wrappedComponentName ${positionalParams} ${attributesMap} target=target as |a b c d e f g h i j k|}}
            {{yield a b c d e f g h i j k}}
          {{/component}}
        {{/if}}
      {{else}}
        {{component wrappedComponentName ${positionalParams} ${attributesMap} target=target}}
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
  __isAlive() {
    return  !this.isDestroyed && !this.isDestroying;
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
          later(() => {
            if (!this.__isAlive()) {
                return;
            }
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
