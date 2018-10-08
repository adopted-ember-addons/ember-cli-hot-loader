import Component from '@ember/component';
export default Component.extend({
  tagName: 'div',
  classNames: ['excluded-slashed__js-only'],
  didRender() {
    this.element.innerHTML = '<button>JS-only component</button>';
  }
});
