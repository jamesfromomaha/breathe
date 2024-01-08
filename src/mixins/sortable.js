import { mixin } from './mixin';
import { message_passing } from './message_passing';

const default_compare = function (
  { [this._compare_key]: a },
  { [this._compare_key]: b }
) {
  const result = +(a > b) || -(b > a) || 0;
  return this._ascending ? result : -result;
}

export const sortable = mixin(proto, cls) {
  const { pub, sub } = message_passing(proto, cls);

  sub('custom-element', 'connect', function () {
    this._compare = default_compare;
    this._compare_key = 'key';
    this._ascending = true;
  });

  sub('custom-element', 'attribute', function (name, previous, value) {
    if (previous !== value)
      switch (name) {
      case 'asc':
        const new_asc = !!value;
        if (new_asc !== this._ascending) {
          this._ascending = new_asc;
          this.sort();
        }
        return 'done';
      case 'compare':
        let new_compare = this._compare;
        if (!value || value === 'default') new_compare = default_compare;
        else if (typeof this[value] === 'function') new_compare = this[value];
        else console.error(`There is no instance method '${value}'`);
        if (new_compare !== this._compare) {
          this._compare = new_compare;
          this.sort();
        }
        return 'done';
      case 'compare-key':
        const new_key = value ?? 'key';
        if (new_key !== this._compare_key) {
          this._compare_key = new_key;
          if (this._collection) this.sort();
        }
        return 'done';
      }
  });

  proto.sort = function (subject) {
    subject ||= this._collection;
    subject.sort(this._compare.bind(this));
    pub('sortable', 'sort', subject);
    return this;
  };

  return cls;
};
