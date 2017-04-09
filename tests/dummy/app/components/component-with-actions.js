import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    <a {{action 'myAction' }}>Some button</a>
  `,
  actions: {
    myAction () {
      this.sendAction('componentAction');
    }
  }
});
