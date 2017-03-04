import {clearRequirejsCache} from 'ember-cli-hot-loader/utils/clear-requirejs';
import {module} from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Utility | clear requirejs');

// Ensure modulePrefix is used to construct the correct path
test('it works with modulePrefix', function () {
  const mock = this.mock(window.requirejs);
  mock.expects("has").once().withExactArgs('foo/components/bar').returns(true);
  mock.expects("has").once().withExactArgs('foo/templates/components/bar').returns(true);
  mock.expects("has").once().withExactArgs('foo/components/bar/component').returns(true);
  mock.expects("has").once().withExactArgs('foo/components/bar/template').returns(true);

  mock.expects("unsee").once().withExactArgs('foo/components/bar');
  mock.expects("unsee").once().withExactArgs('foo/templates/components/bar');
  mock.expects("unsee").once().withExactArgs('foo/components/bar/component');
  mock.expects("unsee").once().withExactArgs('foo/components/bar/template');

  clearRequirejsCache({modulePrefix: 'foo'}, 'bar');

  mock.verify();
});

// Ensure if podModulePrefix exists, it is used to construct the correct path for pod modules
test('it works with podModulePrefix', function () {
  const mock = this.mock(window.requirejs);
  mock.expects("has").once().withExactArgs('foo/components/bar').returns(true);
  mock.expects("has").once().withExactArgs('foo/templates/components/bar').returns(true);
  mock.expects("has").once().withExactArgs('foo/pods/components/bar/component').returns(true);
  mock.expects("has").once().withExactArgs('foo/pods/components/bar/template').returns(true);

  mock.expects("unsee").once().withExactArgs('foo/components/bar');
  mock.expects("unsee").once().withExactArgs('foo/templates/components/bar');
  mock.expects("unsee").once().withExactArgs('foo/pods/components/bar/component');
  mock.expects("unsee").once().withExactArgs('foo/pods/components/bar/template');

  clearRequirejsCache({modulePrefix: 'foo', podModulePrefix: 'foo/pods'}, 'bar');
});

// Ensure that if has() returns false, unsee() is not called
test('it doesnt call unsee() if has() returns false', function () {
  const mock = this.mock(window.requirejs);
  mock.expects("has").once().withExactArgs('foo/components/bar').returns(true);
  mock.expects("has").once().withExactArgs('foo/templates/components/bar').returns(false);
  mock.expects("has").once().withExactArgs('foo/components/bar/component').returns(true);
  mock.expects("has").once().withExactArgs('foo/components/bar/template').returns(false);

  mock.expects("unsee").once().withExactArgs('foo/components/bar');
  mock.expects("unsee").never().withExactArgs('foo/templates/components/bar');
  mock.expects("unsee").once().withExactArgs('foo/components/bar/component');
  mock.expects("unsee").never().withExactArgs('foo/components/bar/template');

  clearRequirejsCache({modulePrefix: 'foo'}, 'bar');
});

