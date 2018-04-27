/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-lts-2.18',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0'
        }
      }
    },
    {
      name: 'ember-3.0',
      npm: {
        devDependencies: {
          'ember-source': '~3.0.0'
        }
      }
    },
    {
      name: 'ember-3.1',
      npm: {
        devDependencies: {
          'ember-source': '~3.1.1'
        }
      }
    }
  ]
};
