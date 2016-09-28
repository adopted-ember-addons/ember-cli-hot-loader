import Ember from 'ember';

var InnerComponent = Ember.Component.extend();

InnerComponent.reopenClass({
  positionalParams: ['name', 'age']
});

export default InnerComponent;
