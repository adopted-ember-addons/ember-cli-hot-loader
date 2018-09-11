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


const TEMPLATE_CACHE_MAX_SIZE = 10000;
const TEMPLATE_CACHE_GC_TIMEOUT = 1000;
var TemplatesCache = {};
var TemplateCacheCheckTimeout = null;

function hashString(str) {

    let hash = 0;
    if (str.length == 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return String(hash);

}

function checkTemplatesCacheLimit() {
    // allow only 10k component templates in cache
    clearTimeout(TemplateCacheCheckTimeout);
    TemplateCacheCheckTimeout = setTimeout(()=>{
        if (Object.keys(TemplatesCache).length > TEMPLATE_CACHE_MAX_SIZE) {
            TemplatesCache = {};
        }
    }, TEMPLATE_CACHE_GC_TIMEOUT);
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
    const templateLayout = `
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
    `;
    const templateHash = hashString(templateLayout);
    if (!TemplatesCache[templateHash]) {
        TemplatesCache[templateHash] = Ember.HTMLBars.compile(templateLayout); 
    }
    checkTemplatesCacheLimit();
    return TemplatesCache[templateHash];
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
          later(() => {
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
