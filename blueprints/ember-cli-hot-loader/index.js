/*jshint node:true*/
module.exports = {
  description: 'Adds configuration required by ember-cli-hot-loader',
  normalizeEntityName: function() {
    // The entitiy name isn't required, but ember-cli crashes without it
    return 'irrelevant';
  }
};
