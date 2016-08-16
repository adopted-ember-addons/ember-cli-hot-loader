import Ember from 'ember';
import HotReplacementComponent from 'ember-cli-hot-loader/components/hot-replacement-component';

export default Ember.Mixin.create({
  resolveOther (parsedName) {
    const resolved = this._super(...arguments);
    if (parsedName.type === 'component') {
      if (resolved) {
        return this._resolveComponent(resolved, parsedName);
      }
      if (parsedName.fullName.match(/\-original$/)) {
        parsedName.fullName = parsedName.fullName.replace(/-original$/, '');
        parsedName.fullNameWithoutType = parsedName.fullNameWithoutType.replace(/-original$/, '');
        parsedName.name= parsedName.name.replace(/-original$/, '');
        return this._super(parsedName);
      }
    }
    return resolved;
  },

  _resolveComponent (resolved, parsedName) {
    return HotReplacementComponent.createClass(resolved, parsedName);
  }
});
