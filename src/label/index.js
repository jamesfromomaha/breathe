import { attrs2class } from '../util';

class Text extends HTMLSpanElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('class', attrs2class.call(this, {
      base: 'label',
      attrs: [
        'compact',
        ['err', 'info', 'inv', 'ok', 'warn'],
        'inset',
        ['round', 'rounded'],
      ],
    }));
  }
}


