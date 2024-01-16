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
  _bus = [];

  adoptedCallback() {
    this.pub('custom-element', 'pre-adopt');
    setImmediate(() => this.pub('custom-element', 'post-adopt'));
  }
  connectedCallback() {
    this.pub('custom-element', 'pre-connect');
    setImmediate(() => this.pub('custom-element', 'post-connect'));
  }
  disconnectedCallback() {
    this.pub('custom-element', 'pre-disconnect');
    setImmediate(() => {
      this.pub('custom-element', 'post-disconnect')
      this.destructor();
    });
  }
  attributeChangedCallback(name, prev, value) {
    this.pub('custom-element', 'pre-attribute', { name, prev, value });
    setImmediate(() => this.pub('custom-element', 'post-attribute'));
  }

  destructor() {
    this.unsub_all();
  }

  pub(channel, event, ...data) {
    if ((channel = this._bus.get(channel)) && (event = channel.get(event)))
      for (const [context, callback] of event)
        if (callback.apply(context, data)) break;
  }

  sub(channel, event, callback) {
    if (channel === 'custom-element') {
      if (!event.includes('-')) event = `pre-${event}`;
      if (!methods.has(event))
        return console.error(`Invalid event '${name}' for 'custom-element' channel`);
    }
    if (!this._bus.has(channel)) this._bus.set(channel, new Map());
    channel = this._bus.get(channel);
    if (!channel.has(event)) channel.set(event, []);
    channel.get(event).push([this, callback]);
  }

  unsub(channel, event, callback) {
    if (!channel) unsub_all();
    else if (channel = this._bus.get(channel)) {
      if (!event) unsub_channel(channel);
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

  unsub_all() {
    for (const [channel, _] of this._bus) unsub_channel(channel);
  }

  unsub_channel(channel) {
    for (const event of channel.keys()) this.unsub(channel, event);
  }
};
