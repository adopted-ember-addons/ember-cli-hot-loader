import Ember from 'ember';
import HotReplacementComponent from 'ember-cli-hot-loader/components/hot-replacement-component';

function removeOriginalFromParsedName (parsedName) {
  parsedName.fullName = parsedName.fullName.replace(/-original$/, '');
  parsedName.fullNameWithoutType = parsedName.fullNameWithoutType.replace(/-original$/, '');
  parsedName.name= parsedName.name.replace(/-original$/, '');
}

function looksLikePartial (parsedName) {
  const nameSegments = parsedName.name.split('/');
  return nameSegments[nameSegments.length -1].match(/^-/);
}

function shouldIgnoreTemplate (parsedName) {
  if (looksLikePartial(parsedName)) {
    return false; // If it's a partial don't ignore it, simply return the default
  }
  return parsedName.fullName.match(/template:components\//) && !parsedName.fullName.match(/\-original$/);
}

export default Ember.Mixin.create({
  resolveOther (parsedName) {
    if (parsedName.type === 'template' && shouldIgnoreTemplate(parsedName)) {
      return;
    }

    const resolved = this._super(...arguments);
    if (parsedName.type === 'component') {
      if (resolved) {
        return this._resolveComponent(resolved, parsedName);
      }
      if (this._resolveOriginalTemplateForComponent(parsedName)) {
        return this._resolveComponent(Ember.Component.extend(), parsedName);
      }
      if (parsedName.fullName.match(/\-original$/)) {
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
  }
});
