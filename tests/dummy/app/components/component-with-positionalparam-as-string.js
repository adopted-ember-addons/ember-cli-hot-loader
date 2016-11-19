import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const Component = Ember.Component.extend({
  // layout,  // The layout comes from the resoler as classic components do
  param1: 'default value',
  layout: hbs`
    <p>prop from positional param: {{param1}}</p>
  `,
});

Component.reopenClass({
  positionalParams: 'param1'
});

export default Component;
