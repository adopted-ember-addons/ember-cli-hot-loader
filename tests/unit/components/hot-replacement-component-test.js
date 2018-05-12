import { module } from 'qunit';
import { test } from 'ember-qunit';
import { matchingComponent, matchesPodConvention, matchesClassicConvention } from 'ember-cli-hot-loader/components/hot-replacement-component';

// NOTE: we test the functions of the class, not really the component
// as a component, for that we'll write integration or acceptance tests
module('Unit | Component | hot replacement component', {
  unit: true
});

test('matchingComponent for posix and windows modulePaths', function (assert) {
  assert.ok(matchingComponent('header-markup', '/Users/billut/code/rando/todomvc/app/templates/components/header-markup.hbs'));
  assert.ok(matchingComponent('header-markup', '\\Users\\billut\\code\\rando\\todomvc\\app\\templates\\components\\header-markup.hbs'));
});

test('matchesPodConvention', function (assert) {
  // TODO: add support for addons
  assert.ok(matchesPodConvention('my-component', 'disk/path/to/app/components/my-component/component.js'));
  assert.ok(matchesPodConvention('template-only-pod', 'disk/path/to/app/components/template-only-pod/template.hbs'));
  assert.ok(matchesPodConvention('my-component/sub-component', 'disk/path/to/app/components/my-component/sub-component/component.js'));
  assert.ok(matchesPodConvention('my-component/sub-component', 'disk/path/to/app/components/my-component/sub-component/template.hbs'));
  assert.ok(matchesPodConvention('my-component/sub-component/woofer-component', 'disk/path/to/app/components/my-component/sub-component/woofer-component/component.js'));
  assert.ok(matchesPodConvention('my-component/sub-component/woofer-component', 'disk/path/to/app/components/my-component/sub-component/woofer-component/template.hbs'));
  assert.notOk(matchesPodConvention('different-component', 'disk/path/to/app/components/my-component/component.js'));
  assert.notOk(matchesPodConvention('my-component', 'disk/path/to/app/different-type/my-component/component.js'));
  assert.notOk(matchesPodConvention('my-component', 'disk/path/to/app/components/different-component/component.js'));
  assert.notOk(matchesPodConvention('my-component', 'disk/path/to/app/components/different-component/component.js'));
});

test('matchesClassicConvention', function (assert) {
  // TODO: add support for addons
  assert.ok(matchesClassicConvention('my-classic-component', 'disk/path/to/app/components/my-classic-component.js'));
  assert.ok(matchesClassicConvention('template-only-classic', 'disk/path/to/app/app/templates/components/template-only-classic.hbs'));
  assert.ok(matchesClassicConvention('my-component/sub-component', 'disk/path/to/app/app/components/my-component/sub-component.js'));
  assert.ok(matchesClassicConvention('my-component/sub-component', 'disk/path/to/app/app/templates/components/my-component/sub-component.hbs'));
  assert.ok(matchesClassicConvention('my-component/sub-component/woofer-component', 'disk/path/to/app/app/components/my-component/sub-component/woofer-component.js'));
  assert.ok(matchesClassicConvention('my-component/sub-component/woofer-component', 'disk/path/to/app/app/templates/components/my-component/sub-component/woofer-component.hbs'));
  assert.notOk(matchesClassicConvention('different-component', 'disk/path/to/app/components/my-classic-component.js'));
  assert.notOk(matchesClassicConvention('my-classic-component', 'disk/path/to/app/different-type/my-classic-component.js'));
  assert.notOk(matchesClassicConvention('my-classic-component', 'disk/path/to/app/components/different-component.js'));
  assert.notOk(matchesClassicConvention('my-classic-component', 'disk/path/to/app/components/my-classic-component.xx'));
});
