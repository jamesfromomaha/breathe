import { Esc } from '../esc.js';

class Tag extends Esc(HTMLSpanElement) {
  constructor() {
    super();
    this.style_attrs = [
      'compact',
      ['err', 'info', 'inv', 'ok', 'warn'],
      'inset',
      ['round', 'rounded'],
    ];
  }

  connectedCallback() {
    this.setAttribute('class', `esc-tag ${this.attrs2class()}`);
  }
}

customElements.define('esc-tag', Tag, { extends: 'span' });
