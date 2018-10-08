import Resolver from 'ember-resolver';
import HotReloadMixin from 'ember-cli-hot-loader/mixins/hot-reload-resolver';
import Mixin from '@ember/object/mixin';

const CustomHotReloadMixin = Mixin.create(HotReloadMixin, {
  shouldExcludeComponent({name}) {
    const excludedFromConfig = this._super(...arguments);
    const isSlashedComponent = name.startsWith('excluded-slashed');
    return excludedFromConfig || isSlashedComponent;
  }
});

export default Resolver.extend(CustomHotReloadMixin);