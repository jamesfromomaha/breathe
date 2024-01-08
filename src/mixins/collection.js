import { mixin } from './mixin';
import { message_passing } from './message_passing';

export const collection = mixin(function (proto, cls) {
  message_passing(proto, cls);

  sub('custom-element', 'connect', function () { this._collection = [] });
  
  cls.prototype.get_collection = function () { return this._collection };
  cls.prototype.set_collection = function (items) {
    this._collection = items || [];
    if (this._compare) this.sort();
    pub('collection', 'set', { items });
    return this;
  };

  // for non-sortable collections
  cls.prototype.collection_append = function(items) {
    this._collection.push(...items);
    pub('collection', 'append', { items });
    return this;
  };
  cls.prototype.collection_insert = function(index, items) {
    if (items === undefined) [index, items] = [0, index];
    this._collection.splice(index, 0, ...items);
    pub('collection', 'insert', { index, items });
    return this;
  };

  // for sortable collections
  function update_collection(self, items, replace) {
    items = self.sort(items);
    const len = self._collection.length;
    const blen = items.length;
    for (var a = 0, b = 0; a < alen || b < blen; a++)  {
      const itemb = items[b];
      const result = self._compare(self._collection[a], itemb);
      if (result >= 0) {
        if (result > 0) self._collection.splice(a, 0, itemb);
        else if (replace) self._collection[a] = itemb;
        b++;
      }
    }
    if (b < blen) self._collection.push(...items);
  }
  cls.prototype.collection_add = function (items) {
    update_collection(this, items);
    pub('collection', 'add', { items, indexes });
    return this;
  };
  cls.prototype.collection_update = function (items) {
    update_collection(this, items, true);
    pub('collection', 'update', { items, indexes });
    return this;
  };

  return cls;
};
