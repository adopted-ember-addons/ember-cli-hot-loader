import { module } from 'qunit';
import { test } from 'ember-qunit';
import { matchesPodConvention, matchesClassicConvention } from 'ember-cli-hot-loader/components/hot-replacement-component';

// NOTE: we test the functions of the class, not really the component
// as a component, for that we'll write integration or acceptance tests
module('Unit | Component | hot replacement component', {
  unit: true
});

test('matchesPodConvention', function (assert) {
  // TODO: add support for addons
  assert.ok(matchesPodConvention('my-component', 'disk/path/to/app/components/my-component/component.js'));
  assert.notOk(matchesPodConvention('different-component', 'disk/path/to/app/components/my-component/component.js'));
  assert.notOk(matchesPodConvention('my-component', 'disk/path/to/app/different-type/my-component/component.js'));
  assert.notOk(matchesPodConvention('my-component', 'disk/path/to/app/components/different-component/component.js'));
  assert.notOk(matchesPodConvention('my-component', 'disk/path/to/app/components/my-component/template.hbs'));
});

test('matchesClassicConvention', function (assert) {
  // TODO: add support for addons
  assert.ok(matchesClassicConvention('my-classic-component', 'disk/path/to/app/components/my-classic-component.js'));
  assert.notOk(matchesClassicConvention('different-component', 'disk/path/to/app/components/my-classic-component.js'));
  assert.notOk(matchesClassicConvention('my-classic-component', 'disk/path/to/app/different-type/my-classic-component.js'));
  assert.notOk(matchesClassicConvention('my-classic-component', 'disk/path/to/app/components/different-component.js'));
  assert.notOk(matchesClassicConvention('my-classic-component', 'disk/path/to/app/components/my-classic-component.xx'));
});
