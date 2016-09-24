import Ember from 'ember';

/**
  The `willLiveReload` event is fired when we have any JS or HBS changes
  detected by Ember CLI. This gives you an opportunity to cancel the
  regular liveReload in case we need .

  The event fires 10ms *after* liveReload, if you want to prevent
  liveReloading, you need to handle the cancelable event `willLiveReload`.

  ```javascript
  Ember.Something.extend({
    hotReload: Ember.inject.service(),
    init () {
      this.get('hotReload').on('willLiveReload', (event)=>{
        if (event.modulePath.match('foo')) {
          event.cancel = true;
        }
      })
    }
  });
  ```

  @event willLiveReload
  @param {Object} [event] A cancelable event with the modulePath
    modulePath: {String}
    cancel: {Boolean} indicates if we should cancel liveReloading
  @public
*/

/**
  The `newChanges` event is fired when we have any JS or HBS changes
  detected by Ember CLI. This gives you an opportunity to handle
  the event.

  The event fires 10ms *after* liveReload, if you want to prevent
  liveReloading, you need to handle the cancelable event `willLiveReload`.

  ```javascript
  Ember.Component.extend({
    hotReload: Ember.inject.service(),
    init () {
      this.get('hotReload').on('newChanges', (modulePath)=>{
        if (modulePath.match('foo')) {
          window.alert('bar');
        }
      })
    },

    willDestroy () {
      this.get('hotReload').off('newChanges');
    }
  });
  ```

  @event newChanges
  @param {String} modulePath
  @public
*/


export default Ember.Service.extend(Ember.Evented);
