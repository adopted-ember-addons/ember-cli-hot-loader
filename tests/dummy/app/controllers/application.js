import Ember from 'ember';
export default Ember.Controller.extend({
  actions: {
    routeAction () {
      console.log('Action handled by the application controller');
    }
  }
});
