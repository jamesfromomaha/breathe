function attrs2class({ base, attrs }) {
  const classes = attrs.map((attr) => {
    const prop = Array.isArray(attr)
      ? attr.find((a) => this.hasAttribute(a))
      : this.hasAttribute(attr) && attr;
    if (prop) return `.esc-${prop}`;
  });
  return `.esc-${base}${classes.join('')}`;
}

export {
  attrs2class,
};
