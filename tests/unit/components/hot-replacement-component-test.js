import { module } from 'qunit';
import { test } from 'ember-qunit';
import { TEMPLATE_CACHE_MAX_SIZE, TemplatesCache, TemplateCacheCheckTimeout, checkTemplatesCacheLimit, hashString, matchingComponent, matchesPodConvention, matchesClassicConvention } from 'ember-cli-hot-loader/components/hot-replacement-component';
import { Promise as EmberPromise } from 'rsvp';
// NOTE: we test the functions of the class, not really the component
// as a component, for that we'll write integration or acceptance tests
module('Unit | Component | hot replacement component', {
  unit: true
});

function wait(ms) {
    return new EmberPromise((resolve)=> setTimeout(resolve, ms));
}

test('matchingComponent for posix and windows modulePaths', function (assert) {
  assert.ok(matchingComponent('header-markup', '/Users/billut/code/rando/todomvc/app/templates/components/header-markup.hbs'));
  assert.ok(matchingComponent('header-markup', '\\Users\\billut\\code\\rando\\todomvc\\app\\templates\\components\\header-markup.hbs'));
  assert.ok(matchingComponent('x-prefixed/header-markup', '/Users/billut/code/rando/todomvc/app/templates/components/x-prefixed/header-markup.hbs'))
  assert.ok(matchingComponent('x-prefixed/header-markup', '\\Users\\billut\\code\\rando\\todomvc\\app\\templates\\components\\x-prefixed\\header-markup.hbs'));
});

test('typescript matches found', function (assert) {
  assert.ok(matchingComponent('my-component', 'disk/path/to/app/components/my-component/component.ts'));
  assert.ok(matchingComponent('my-component/sub-component', 'disk/path/to/app/components/my-component/sub-component/component.ts'));
  assert.ok(matchingComponent('my-classic-component', 'disk/path/to/app/components/my-classic-component.ts'));
  assert.ok(matchingComponent('my-component/sub-component', 'disk/path/to/app/app/components/my-component/sub-component.ts'));
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

test('canHashTemplteLayoutString', function (assert) {
    assert.equal(typeof hashString('foo-bar'), 'string', 'result must be an numeric string');
    assert.equal(hashString('foo-bar'), '-682120564');
    assert.equal(hashString('bar-baz'), '-335205535');
    assert.equal(hashString('{{some-component foo=bar}}'), '1904495296');
    assert.equal(hashString('{{some-component foo=baz}}'), '1904502984');
});

test('templateHashesForSameStringsMustBeEqual', function (assert) {
    assert.equal(hashString('foo-bar'), hashString('foo-bar'));
    assert.equal(hashString('bar-baz'), hashString('bar-baz'));
    assert.equal(hashString('{{some-component foo=bar}}'), hashString('{{some-component foo=bar}}'));
    assert.equal(hashString('{{some-component foo=baz}}'), hashString('{{some-component foo=baz}}'));
});

test('checkTemplateHashLimitMustCreateTimeoutForCheckFunction', function (assert) {
    const initialTimeoutCounterRef = TemplateCacheCheckTimeout;
    checkTemplatesCacheLimit();
    assert.notEqual(TemplateCacheCheckTimeout, initialTimeoutCounterRef);
});

test('templateCacheMustBeAnNonNullableObject', function (assert) {
    assert.equal(typeof TemplatesCache, 'object');
    assert.notEqual(TemplatesCache, null);
});

test('checkTemplatesCacheWipe', async function (assert) {
    // lets escape from possible cache cleanup
	clearTimeout(TemplateCacheCheckTimeout)
	const cacheCheckerTimeout = 10;
    const cachedItems = Object.keys(TemplatesCache);
    const itemsToAddToCache = TEMPLATE_CACHE_MAX_SIZE - cachedItems.length;
    for (let i = 0; i < itemsToAddToCache; i++) {
        TemplatesCache[`key-${Math.random().toString(36).slice(2)}`] = {};
    }
    assert.equal(Object.keys(TemplatesCache).length, TEMPLATE_CACHE_MAX_SIZE, 'cache is full');
    checkTemplatesCacheLimit(cacheCheckerTimeout);
    await wait(cacheCheckerTimeout);
    assert.equal(Object.keys(TemplatesCache).length, TEMPLATE_CACHE_MAX_SIZE, 'cache is full, but not cleaned');
    TemplatesCache[`key-foo-bar`] = {};
    assert.notEqual(Object.keys(TemplatesCache).length, TEMPLATE_CACHE_MAX_SIZE, 'cache size if perfect to clean');
    checkTemplatesCacheLimit(cacheCheckerTimeout);
    await wait(cacheCheckerTimeout);
    assert.equal(Object.keys(TemplatesCache).length, 0, 'cache cleaned');
});