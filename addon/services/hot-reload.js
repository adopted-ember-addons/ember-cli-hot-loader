import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  init () {
    //TODO: non global alternatives please :)
    window.hotReloadService = this;
    this._super(...arguments);
  }
});
