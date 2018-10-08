import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout:  hbs`
    <p>Inline slashed component rendering test <span>{{myName}}</span> <button>{{myName}}</button></p>
  `,
  myName: 'excluded-slashed/inline-template'
});