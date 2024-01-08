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

function pub(channel, event, ...data) {
  if ((channel = this._bus.get(channel)) && (event = channel.get(event)))
    for (const [context, callback] of event)
      if (callback.apply(context, data)) break;
}

function sub(channel, event, callback) {
  if (channel === 'custom-element') {
    if (!event.includes('-')) event = `pre-${event}`;
    wrap_method(this, event.split('-').pop());
  }
  if (!this._bus.has(channel)) this._bus.set(channel, new Map());
  channel = this._bus.get(channel);
  if (!channel.has(event)) channel.set(event, []);
  channel.get(event).push([this, callback]);
}

function unsub(channel, event, callback) {
  if (!channel) unsub_all(this);
  else if (channel = this._bus.get(channel)) {
    if (!event) unsub_channel(this, channel);
    else {
      const consumers = channel.get(event);
      if (consumers) {
        const filter = callback
          ? ([a, b]) => a !== this || b !== callback
          : ([a, _]) => a !== this;
        channel.set(event, consumers.filter(filter));
      }
    }
  }
}
function unsub_all(self) {
  self ||= this;
  for (const [channel, _] of self._bus) unsub_channel(self, channel);
}
function unsub_channel(self, channel) {
  for (const event of channel.keys())
    unsub.call(self, channel, event);
}

export function message_passing(prototype, cls) {
  cls._destructors.push(unsub);
  if (!prototype._bus) {
    cls._bus = new Map();
    prototype._bus = cls._bus;
  }
  return {
    pub: prototype.pub = pub.bind(prototype),
    sub: prototype.sub = sub.bind(prototype),
    unsub: prototype.unsub = unsub.bind(prototype),
  };
};
