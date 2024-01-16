const default_compare = function (
  { [this._collection_key]: a },
  { [this._collection_key]: b }
) {
  const result = +(a > b) || -(b > a) || 0;
  return this._ascending ? result : -result;
}

export const sortable_attributes = ['asc', 'compare']


export const sortable = function (cls) {
  sub('custom-element', 'connect', function () {
    this._compare = default_compare;
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
        else if (typeof window[value] === 'function') new_compare = window[value];
        else console.error(`There is no method '${value}' in scope`);
        if (new_compare !== this._compare) {
          this._compare = new_compare;
          this.sort();
        }
        return 'done';
      }
  });

  cls.prototype.sort = function (subject) {
    subject ||= this._collection;
    subject.sort(this._compare.bind(this));
    pub('sortable', 'sort', subject);
    return this;
  };

  return cls;
};
