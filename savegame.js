ig.module(
  'plugins.savegame'
)
.requires(
  'impact.impact'
)
.defines(function() {
  ig.Savegame = ig.Class.extend({

    localStorageName: 'localStorage',
    namespace: '__storejs__',

    disabled: false,

    init: function(savegameVersion) {

      if (typeof savegameVersion == "undefined") {
        throw {
          name: "VersionNotSet",
          message: "You need to set the savegame version.",
          toString: function(){return "[ig.Savegame] You need to set the savegame version.";}
        }
      }

      if (this.isLocalStorageNameSupported()) {
        this.storage = window[this.localStorageName];

        this.set = function(key, val) {
          if (val === undefined) return this.remove(key);
          this.storage.setItem( key, this.serialize(val) );
          return val;
        }

        this.get = function(key) {
          return this.deserialize( this.storage.getItem(key) );
        }

        this.remove = function(key) {
          this.storage.removeItem(key);
        }

        this.clear = function() {
          this.storage.clear();
        }

        this.getAll = function() {
          var ret = {};
          for (var i = 0; i < this.storage.length; ++i) {
            var key = this.storage.key(i);
            ret[key] = this.get(key);
          }
          return ret;
        }
      }

      try {
        this.set(this.namespace, this.namespace);
        if (this.get(this.namespace) != this.namespace) {
          this.disabled = true;
        }
        this.remove(this.namespace);
      } catch(e) {
        this.disabled = true;
      }

      if (!this.disabled) {
        var version = this.get('savegameVersion');
        if (version) {
          if (version < savegameVersion) {
            this.clear();
            this.set('savegameVersion', savegameVersion);
          }
        } else {
          this.set('savegameVersion', savegameVersion);
        }
      }

    },

    set: function(key, val) {},
    get: function(key) {},
    remove: function(key) {},
    clear: function() {},
    getAll: function() {},

    transact: function(key, defaultVal, transactionFn) {
      var val = this.get(key);
      if (transactionFn == null) {
        transactionFn = defaultVal;
        defaultVal = null;
      }
      if (typeof val == 'undefined') {
        val = defaultVal || {};
      }
      transactionFn(val);
      this.set(key, val);
    },

    serialize: function(value) {
      return JSON.stringify(value);
    },

    deserialize: function(value) {
      if (typeof value != 'string') return;
      try {
        return JSON.parse(value);
      } catch(e) {
        return value || undefined;
      }
    },

    isLocalStorageNameSupported: function() {
      try {
        return (this.localStorageName in window && window[this.localStorageName]);
      } catch(e) {
        return false;
      }
    }

  });
});
