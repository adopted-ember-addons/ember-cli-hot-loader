import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

const MyComponent = Component.extend({
  // layout,  // The layout comes from the resoler as classic components do
  param1: 'default value',
  layout: hbs`
    <p>prop from positional param: {{param1}}</p>
  `,
});

MyComponent.reopenClass({
  positionalParams: 'param1'
});

export default MyComponent;
