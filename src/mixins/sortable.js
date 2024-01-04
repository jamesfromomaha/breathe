import { message_passing } from './message_passing';

const compare = ({ key: a }, { key: b }) => +(a > b) || -(b > a) || 0;

export function sortable(cls, { pub, sub, unsub }) {
  const { pub, sub, unsub } = message_passing(cls);
  const { prototype } = cls;

  sub('custom-element', 'connect', function () {
    this._compare = compare;
    this._ascending = true;
  });

  sub('custom-element', 'attribute', function (name, _, value) {
    switch (name) {
    case 'asc':
      this.asc = !!value;
      if (this.has_collection) this.order_collection();
      return 'cancel';
    case 'compare':
      let ok = false;
      if (ok = (name === 'asc')) this.asc = !!value;
      else if (ok = (!value || value === 'default'))
        this._compare = default_compare;
      else if (ok = (typeof this[value] === 'function'))
        this._compare = this[value];
      else
        console.error(`Instance method '${value}' is not available`);
      if (ok && this.has_collection) this.sort_collection();
      return 'cancel';
    }
  });

  pro.resort = function () {
    
  };

  return cls;
};
