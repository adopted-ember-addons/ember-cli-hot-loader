import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['excluded-slashed-pod__js-only'],
  didRender() {
    this.element.innerHTML = '<button>excluded- JS-only component</button>';
  }
});
