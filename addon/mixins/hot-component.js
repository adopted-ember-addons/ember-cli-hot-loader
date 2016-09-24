import Ember from 'ember';

export default Ember.Mixin.create({
  hotReload: Ember.inject.service(),
  init () {
    this._super(...arguments);
    this.get('hotReload').on('newChanges', this, '__rerenderOnTemplateUpdate');
    this.get('hotReload').on('willLiveReload', this, '__willLiveReload');
  },
  willDestroyElement () {
    this._super(...arguments);
    this.get('hotReload').off('newChanges', this, '__rerenderOnTemplateUpdate');
    this.get('hotReload').off('willLiveReload', this, '__willLiveReload');
  },
  __rerenderOnTemplateUpdate (/*moduleName*/) {
    // abstract, to be overridden by mixee
  }
});
