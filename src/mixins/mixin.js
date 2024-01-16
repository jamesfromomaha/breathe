export function mixin(cb) {
  return function (cls) {
    const { __proto__: proto } = cls._instance ||= cls.prototype || new cls();
    if (!cls._destructors) {
      cls._destructors = [];
      proto.destructor = function () {
        for (const f of cls._destructors) f.call(this);
      }
    }
    cb(proto, cls);
    return cls;
  };
};
