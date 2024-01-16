const methods = new Set();
methods.add('pre-adopt');
methods.add('post-adopt');
methods.add('pre-connect');
methods.add('post-connect');
methods.add('pre-disconnect');
methods.add('post-disconnect');
methods.add('pre-attribute');
methods.add('post-attribute');


export class EscElement extends HTMLElement {
  static _bus = new Map();

  constructor() {
    super();
    this._bus = EscElement._bus;
    this.pub = EscElement.pub;
    this.sub = EscElement.sub;
    this.unsub = EscElement.unsub;
    this.unsub_channel = EscElement.unsub_channel;
    this.unsub_all = EscElement.unsub_all;
  }

  adoptedCallback() {
    this.pub('custom-element', 'pre-adopt');
    setTimeout(() => this.pub('custom-element', 'post-adopt'), 0);
  }
  connectedCallback() {
    this.pub('custom-element', 'pre-connect');
    setTimeout(() => this.pub('custom-element', 'post-connect'), 0);
  }
  disconnectedCallback() {
    this.pub('custom-element', 'pre-disconnect');
    setTimeout(() => {
      this.pub('custom-element', 'post-disconnect')
      this.destructor();
    }, 0);
  }
  attributeChangedCallback(name, prev, value) {
    this.pub('custom-element', 'pre-attribute', { name, prev, value });
    setTimeout(() => this.pub('custom-element', 'post-attribute'), 0);
  }

  destructor() {
    this.unsub_all();
  }

  static pub(channel, event, ...data) {
    const self = this || EscElement;
    const { _bus } = EscElement;
    if ((channel = _bus.get(channel)) && (event = channel.get(event)))
      for (const [context, callback] of event)
        if (callback.apply(context, data)) break;
  }

  static sub(channel, event, callback) {
    const self = this || EscElement;
    if (channel === 'custom-element') {
      if (!event.includes('-')) event = `pre-${event}`;
      if (!methods.has(event))
        return console.error(`Invalid event '${name}' for 'custom-element' channel`);
    }
    if (!self._bus.has(channel)) self._bus.set(channel, new Map());
    channel = self._bus.get(channel);
    if (!channel.has(event)) channel.set(event, []);
    channel.get(event).push([self, callback]);
  }

  static unsub(channel, event, callback) {
    const self = this || EscElement;
    if (!channel) unsub_all();
    else if (channel = self._bus.get(channel)) {
      if (!event) unsub_channel(channel);
      else {
        const consumers = channel.get(event);
        if (consumers) {
          const filter = callback
            ? ([a, b]) => a !== self || b !== callback
            : ([a, _]) => a !== self;
          channel.set(event, consumers.filter(filter));
        }
      }
    }
  }

  static unsub_all() {
    const self = this || EscElement;
    for (const [channel, _] of self._bus) self.unsub_channel(channel);
  }

  static unsub_channel(channel) {
    const self = this || EscElement;
    for (const event of channel.keys()) self.unsub(channel, event);
  }
};
