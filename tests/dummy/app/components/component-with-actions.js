import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { get } from '@ember/object';

export default Component.extend({
  layout: hbs`
    <a {{action 'myAction' }}>Some button</a>
  `,
  actions: {
    myAction() {
      const theAction = get(this, 'componentAction');
      if (typeof theAction === 'function') {
        theAction();
      } else {
        const targetObject = get(this, 'targetObject');
        if (targetObject && targetObject.sendAction) {
          targetObject.sendAction('componentAction');
        } else {
          this.sendAction('componentAction'); // ember v2.12
        }
      }
    }
  }
});
