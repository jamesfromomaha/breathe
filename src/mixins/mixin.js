const methods = {
  'adopt': 'adoptedCallback',
  'connect': 'connectedCallback',
  'disconnect': 'disconnectedCallback',
  'attribute': 'attributeChangedCallback',
}

function wrap_method(prototype, name) {
  const method = methods[name] && prototype[methods[name]];
  if (typeof method !== 'function') 
    return console.error(`There is no method for an event named '${name}'`);
  if (!method._wrapped) {
    function wrapped(...args) {
      if (pub('custom-element', `pre-${name}`, args)) return;
      if (method.apply(this, args)) return;
      pub('custom-element', `post-${name}`, args);
    };
    wrapped._wrapped = true;
    prototype[name] = wrapped;
  }
};

function pub(namespace, event, ...data) {
  const { events } = this._mixins;
  if ((namespace = events[namespace]) && (event = namespace[event]))
    return event.some((f) => f.apply(this, data));
}

function sub(namespace, event, callback) {
  if (namespace === 'custom-element') {
    if (!event.includes('-')) event = `pre-${event}`;
    wrap_method(this, event.split('-').pop());
  }
  const { events } = this._mixins;
  namespace = events[namespace] ||= {};
  event = namespace[event] ||= [];
  event.push(callback);
}

function unsub(namespace, event, callback) {
  const { events } = this._mixins;
  if ((namespace = events[namespace]) && (event = namespace[event]))
    for (let i = event.length - 1; i; --i)
      if (event[i] === callback) event.splice(i, 1);
}

export function mixin(mixer) {
  return function (cls) {
    const { prototype } = cls;
    prototype._mixins ||= { events: {} };
    return mixer(cls, {
      pub: pub.bind(prototype),
      sub: sub.bind(prototype),
      unsub: unsub.bind(prototype),
    });
  };
};
