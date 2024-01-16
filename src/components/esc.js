const Esc = (Base) => class extends Base {
  attrs2class() {
    return this.style_attrs.map((attr) => {
      const prop = Array.isArray(attr)
        ? attr.find((a) => this.hasAttribute(a))
        : this.hasAttribute(attr) && attr;
      if (prop) return ` esc-${prop}`;
    }).join('').trimStart();
  };
};

export {
  Esc
};
