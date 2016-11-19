import clearCache from 'ember-cli-hot-loader/utils/clear-container-cache';
import moduleForAcceptance from 'dummy/tests/helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance | Utility | clear container cache');

// Replace this with your real tests.
test('it works', function(assert) {
  assert.expect(0);
  let done = assert.async();
  visit('/');
  andThen(() => {
    // Just want to make sure this doesn\'t crash in the different versions of Ember
    clearCache(this.application.__container__.lookup('component:inline-template-pod', 'inline-template-pod'));
    done();
  });
});
