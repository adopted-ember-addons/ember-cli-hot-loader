import Ember from 'ember';
import clearCache from 'ember-cli-hot-loader/utils/clear-container-cache';
import clearRequirejs from 'ember-cli-hot-loader/utils/clear-requirejs';
import layout from '../templates/components/hot-replacement-component';

export function matchesPodConvention (componentName, modulePath) {
  var filePathArray = modulePath.split('/');
  var type = filePathArray[filePathArray.length - 3];
  var componentNameFromPath = filePathArray[filePathArray.length - 2];
  var fileName = filePathArray[filePathArray.length - 1];
  return type === 'components' && componentName === componentNameFromPath && (fileName === 'component.js' || fileName === 'template.hbs');
}
export function matchesClassicConvention (componentName, modulePath) {
  var filePathArray = modulePath.split('/');
  var type = filePathArray[filePathArray.length - 2];
  var componentNameFromPath = filePathArray[filePathArray.length - 1].replace(/.js$|.hbs$/, '');
  return type === 'components' && componentName === componentNameFromPath;
}
function matchingComponent (componentName, modulePath) {
  if(!componentName) {
      return false;
  }
  // For now we only support standard conventions, later we may have a better
  // way to learn from resolver resolutions
  return matchesClassicConvention(componentName, modulePath) ||
    matchesPodConvention(componentName, modulePath);
}

export default Ember.Component.extend({
  baseComponentName: null,
  tagName: '',
  layout,

  hotReload: Ember.inject.service(),
  init () {
    this._super(...arguments);
    this.get('hotReload').on('willHotReload', this, '__rerenderOnTemplateUpdate');
    this.get('hotReload').on('willLiveReload', this, '__willLiveReload');
  },
  willDestroyElement () {
    this._super(...arguments);
    this.get('hotReload').off('willHotReload', this, '__rerenderOnTemplateUpdate');
    this.get('hotReload').off('willLiveReload', this, '__willLiveReload');
  },

  __willLiveReload (event) {
    const baseComponentName = this.get('baseComponentName');
    if (matchingComponent(baseComponentName, event.modulePath)) {
      event.cancel = true;
      clearRequirejs(this, baseComponentName);
    }
  },
  __rerenderOnTemplateUpdate (modulePath) {
      const baseComponentName = this.get('baseComponentName');
      if(matchingComponent(baseComponentName, modulePath)) {
          this._super(...arguments);
          clearCache(this, baseComponentName);
          this.setProperties({
            baseComponentName: undefined
          });
          this.rerender();
          Ember.run.later(()=> {
            this.setProperties({
              baseComponentName: baseComponentName
            });
          });
      }
  }
});
