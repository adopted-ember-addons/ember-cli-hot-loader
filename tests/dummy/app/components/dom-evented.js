import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  classNameBindings: ['isExpanded'],
  isExpanded: false,
  click() {
    this.toggleProperty('isExpanded');
  },
  layout: hbs`
    <p>click to expand me: {{isExpanded}}</p>
  `,
});
