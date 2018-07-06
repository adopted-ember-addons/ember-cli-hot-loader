import Mixin from '@ember/object/mixin';
import Component from '@ember/component';
import HotReplacementComponent from 'ember-cli-hot-loader/components/hot-replacement-component';
import { get, computed } from '@ember/object';
import config from 'ember-get-config';
import { captureTemplateOptions } from 'ember-cli-hot-loader/utils/clear-container-cache';

function removeOriginalFromParsedName (parsedName) {
  parsedName.fullName = parsedName.fullName.replace(/-original$/, '');
  parsedName.fullNameWithoutType = parsedName.fullNameWithoutType.replace(/-original$/, '');
  parsedName.name= parsedName.name.replace(/-original$/, '');
}

function shouldIgnoreTemplate (parsedName) {
  return parsedName.fullName.match(/template:components\//) && !parsedName.fullName.match(/\-original$/); // eslint-disable-line
}

export default Mixin.create({
  resolveOther (parsedName) {
    captureTemplateOptions(parsedName);

    if (parsedName.type === 'template' && shouldIgnoreTemplate(parsedName)) {
      return;
    }

    const resolved = this._super(...arguments);
    if (parsedName.type === 'component') {
      const excluded = get(this, 'excluded');
      if (excluded.some((name) => name === parsedName.name)) {
        return this._super(parsedName);
      }
      if (resolved) {
        return this._resolveComponent(resolved, parsedName);
      }
      if (this._resolveOriginalTemplateForComponent(parsedName)) {
        return this._resolveComponent(Component.extend(), parsedName);
      }
      if (parsedName.fullName.match(/\-original$/)) { // eslint-disable-line
        removeOriginalFromParsedName(parsedName);
        return this._super(parsedName);
      }
    }

    return resolved;
  },
  resolveTemplate (parsedName) {
    if (shouldIgnoreTemplate(parsedName)) {
      return;
    }

    removeOriginalFromParsedName(parsedName);
    return this._super(...arguments);
  },
  _resolveComponent (resolved, parsedName) {
    return HotReplacementComponent.createClass(resolved, parsedName);
  },
  _resolveOriginalTemplateForComponent (parsedName) {
    const templateFullName = `template:components/${parsedName.fullNameWithoutType}-original`;
    const templateParsedName = this.parseName(templateFullName);
    return this.resolveTemplate(templateParsedName) || this.resolveOther(templateParsedName);
  },
  excluded: computed(function() {
    const configuration = config['ember-cli-hot-loader'];
    return configuration ? (configuration['excluded'] || []) : [];
  })
});
