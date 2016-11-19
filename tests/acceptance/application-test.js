import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | application');

test('visits dummy page and renders all wrapped components', function(assert) {
  visit('/');

  andThen(function() {
    // This verifies that at least the dummy page can be rendered
    assert.equal(currentURL(), '/');
  });
});
