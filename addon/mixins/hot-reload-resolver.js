import Mixin from '@ember/object/mixin';
import Component from '@ember/component';
import HotReplacementComponent from 'ember-cli-hot-loader/components/hot-replacement-component';
import { get, computed } from '@ember/object';
import config from 'ember-get-config';
import { captureTemplateOptions } from 'ember-cli-hot-loader/utils/clear-container-cache';

const ORIGINAL_COMPONENT_POSTFIX = '-original';
const TEMPLATE_MATCH_REGEX = new RegExp(/-original$/);

function removeOriginalFromParsedName (parsedName, pattern) {
  parsedName.fullName = parsedName.fullName.replace(pattern, '');
  parsedName.fullNameWithoutType = parsedName.fullNameWithoutType.replace(pattern, '');
  parsedName.name= parsedName.name.replace(pattern, '');
}

function shouldIgnoreTemplate (parsedName, pattern) {
  return parsedName.fullName.match(/template:components\//) && !parsedName.fullName.match(pattern); // eslint-disable-line
}

export default Mixin.create({
  originalTemplateMatchRegex: computed(function(){
    return TEMPLATE_MATCH_REGEX;
  }),
  originalComponentPostfix: computed(function(){
    return ORIGINAL_COMPONENT_POSTFIX;
  }),
  shouldExcludeComponent(parsedName) {
    const excluded = get(this, 'excluded');
    if (excluded.some((name) => name === parsedName.name)) {
      return true;
    } else {
      return false;
    }
  },
  resolveOther(parsedName) {
    captureTemplateOptions(parsedName);
    const templateMatchRegex = get(this, 'originalTemplateMatchRegex');
    if (parsedName.type === 'template' && shouldIgnoreTemplate(parsedName, templateMatchRegex)) {
      return;
    }

    const resolved = this._super(...arguments);
    if (parsedName.type === 'component') {
      if (this.shouldExcludeComponent(parsedName)) {
        return this._super(parsedName);
      }
      if (resolved) {
        return this._resolveComponent(resolved, parsedName);
      }
      if (this._resolveOriginalTemplateForComponent(parsedName)) {
        return this._resolveComponent(Component.extend(), parsedName);
      }
      if (parsedName.fullName.match(templateMatchRegex)) { // eslint-disable-line
        removeOriginalFromParsedName(parsedName, templateMatchRegex);
        return this._super(parsedName);
      }
    }

    return resolved;
  },
  resolveTemplate (parsedName) {
    const templateMatchRegex = get(this, 'originalTemplateMatchRegex');
    if (shouldIgnoreTemplate(parsedName, templateMatchRegex)) {
      return;
    }

    removeOriginalFromParsedName(parsedName, templateMatchRegex);
    return this._super(...arguments);
  },
  _resolveComponent (resolved, parsedName) {
    return HotReplacementComponent.createClass(resolved, parsedName);
  },
  _resolveOriginalTemplateForComponent (parsedName) {
    const templateFullName = `template:components/${parsedName.fullNameWithoutType}${this.originalComponentPostfix}`;
    const templateParsedName = this.parseName(templateFullName);
    return this.resolveTemplate(templateParsedName) || this.resolveOther(templateParsedName);
  },
  excluded: computed(function() {
    const configuration = config['ember-cli-hot-loader'];
    return configuration ? (configuration['excluded'] || []) : [];
  })
});
