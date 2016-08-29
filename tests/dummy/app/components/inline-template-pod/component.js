import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
export default Ember.Component.extend({
  layout: hbs`
    <p>From inline template pod. prop: {{prop1}}</p>
  `,
  prop1: 1
});
