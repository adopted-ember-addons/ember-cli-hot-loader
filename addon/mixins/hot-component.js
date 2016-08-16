import Ember from 'ember';

export default Ember.Mixin.create({
  hotReload: Ember.inject.service(),
  init () {
    this._super(...arguments);
    this.get('hotReload').on('newChanges', this, '__rerenderOnTemplateUpdate');
  },
  willDestroyElement () {
    this._super(...arguments);
    this.get('hotReload').off('newChanges', this, '__rerenderOnTemplateUpdate');
  },
  __rerenderOnTemplateUpdate (/*moduleName*/) {
    // abstract, to be overridden by mixee
  }
});
