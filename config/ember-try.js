/* eslint-disable */

'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta')
  ]).then((urls) => {
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-2.18',
          npm: {
            devDependencies: {
              'ember-source': '~2.18.0'
            }
          }
        },
        {
          name: 'ember-3.1',
          npm: {
            devDependencies: {
              'ember-source': '~3.1.3'
            }
          }
        },
        {
          name: 'ember-3.2',
          npm: {
            devDependencies: {
              'ember-source': '~3.2.2'
            }
          }
        }
      ]
    };
  });
};
