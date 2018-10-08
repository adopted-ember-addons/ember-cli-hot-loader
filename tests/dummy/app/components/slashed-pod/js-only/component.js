import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['slashed-pod__js-only'],
  didRender() {
    this.element.innerHTML = '<button>JS-only component</button>';
  }
});
