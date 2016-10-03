import Ember from 'ember';
import layout from '../templates/components/positional-params';

const PositionalParamsComponent = Ember.Component.extend({
  layout,
  x: 2,
  y: 3,
  z: 4
});
PositionalParamsComponent.reopenClass({
  positionalParams: ['x', 'y', 'z']
});
export default PositionalParamsComponent;
