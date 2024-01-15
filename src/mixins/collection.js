import * as diff from 'fast-array-diff';
import { mixin } from './mixin';
import { message_passing } from './message_passing';

const compare = ({ key: a }, { key: b }) => a === b;

function make_patch(collection) {
  const patch = [];
  let offset = 0, type, l1, l2;
  return {
    append(oldPos, items) {
      const newPos = oldPos + offset;
      patch.push({ type: 'add', oldPos, newPos, items });
      collection.push(...items);
    },
    insert(oldPos, item) {
      if (type === 'add') {
        l1.items.push(item);
      } else {
        const newPos = oldPos + offset++;
        [l2, l1] = [l1, { type: type = 'add', oldPos, newPos, items: [item] }];
        patch.push(l1);
      }
      collection.splice(oldPos, 0, item);
    },
    replace(oldPos, item) {
      if (type === 'replace') {
        l2.length++;
        l1.items.push(item);
      } else {
        type = 'replace';
        const newPos = oldPos + offset;
        patch.push(
          l2 = { type: 'remove', oldPos, newPos, length: 1, replace: true },
          l1 = { type: 'add', oldPos, newPos, items: [item], replace: true }
        );
      }
      collection[index] = item;
    },
    result() {
      return patch;
    }
  };
}

export const collection_attributes = ['key'];
export const collection = mixin(function (proto, cls) {
  const { pub, sub } = message_passing(proto, cls);

  sub('custom-element', 'connect', function () {
    this._collection_key = 'key';
    this._collection = [];
  });

  sub('custom-element', 'attribute', function (name, previous, value) {
    if (previous !== value && name === 'key') {
      const new_key = value ?? 'key';
      if (new_key !== this._collection_key) {
        this._collection_key = new_key;
        if (this._compare) this.sort();
      }
      return 'done';
    }
  });
  
  proto.get_collection = function () { return this._collection };
  proto.set_collection = function (items) {
    this._collection = items || [];
    if (this._compare) this.sort();
    pub('collection', 'set', { items });
    return this;
  };

  // add/update for sortable collections
  function updater(self, items, replace) {
    items = self.sort(items);
    const patch = make_patch(self._collection);
    const len = self._collection.length;
    const blen = items.length;
    for (var a = 0, b = 0; a < alen || b < blen; a++)  {
      const itemb = items[b];
      const result = self._compare(self._collection[a], itemb);
      if (result >= 0) {
        if (result > 0) patch.insert(a, itemb);
        else if (replace) patch.replace(a, itemb);
        b++;
      }
    }
    if (b < blen) patch.append(items);
    return patch.result();
  }

  proto.add_to_collection = function (items) {
    const len = this._collection.length;
    let patch = [{ type: 'add', oldPos: len, newPos: len, items }];
    if (this._compare) patch = updater(this, items);
    else this._collection.push(...items);
    if (patch.length) pub('collection', 'update', { patch });
    return this;
  };

  proto.update_collection = function (items) {
    let patch;
    if (this._compare) {
      patch = updater(this, items, true);
    } else {
      patch = diff.getPatch(this._collection, items, compare)
      this._collection = diff.applyPatch(this._collection, patch);
    }
    if (patch.length) pub('collection', 'update', { patch });
    return this;
  };

  return cls;
});
