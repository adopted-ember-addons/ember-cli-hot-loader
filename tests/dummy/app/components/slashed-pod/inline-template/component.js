import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout:  hbs`
    <p>Inline slashed pod component rendering test <span>{{myName}}</span><button>{{myName}}</button></p>
  `,
  myName: 'slashed-pod/inline-template'
});