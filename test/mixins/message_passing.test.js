import { expect } from 'chai';

import { mixin } from '../../src/mixins/mixin.js';
import { message_passing } from '../../src/mixins/message_passing.js';

const mixin_a = mixin(function (proto, cls) {
  message_passing(proto, cls);
  proto.get_name = function () { pub('name', `mixin_a:${this.name}`) };
  proto.send_message = function (data) {
    this.pub('channel', 'message', data);
  }
  proto.await_message = function (callback) {
    this.sub('channel', 'message', callback);
  };
  proto.halt_messages = function (callback) {
    this.unsub('channel', 'message', callback);
  };
});
const mixin_b = mixin(function (proto, cls) {
  message_passing(proto, cls);
  proto.get_name = function () { this.pub('name', `mixin_b:${this.name}`) };
  proto.send_message = function (data) {
    this.pub('channel', 'message', data);
  }
  proto.await_message = function (callback) {
    this.sub('channel', 'message', callback);
  };
  proto.halt_messages = function (callback) {
    this.unsub('channel', 'message', callback);
  };
});

class RootClass {
  foo = 1;
  bar = 'baz';
  name = 'root';
  constructor() {
    this.foo = 3;
  }
}
class TestClassA extends mixin_a(RootClass) {
  name = 'test_a';
  constructor() {
    super();
    this.foo = 9;
  }
  destructor() {
    super.destructor();
  }
}
class TestClassB extends mixin_b(TestClassA) {
  name = 'test_b';
  constructor() {
    super();
    this.foo = 27;
  }
  destructor() {
    super.destructor();
  }
}

const objects = () => ({
  obj: new RootClass(),
  obja: new TestClassA(),
  objb: new TestClassB(),
});

describe('Message Passing', function () {
  describe('pub/sub works', function () {
    it('should work on itself', function (done) {
      const { obja } = objects();
      const { obja: obj2 } = objects();
      obja.await_message(function (data) {
        expect(data).to.be.undefined;
        done();
      });
      obj2.send_message();
      obja.destructor();
      obj2.destructor();
    });
    it('should work with two consumers', function (done) {
      const { obja } = objects();
      const { obja: obj2 } = objects();
      obja.await_message(function (data) {
        expect(data).to.be.undefined;
      });
      obja.await_message(done);
      obj2.send_message();
      obja.destructor();
      obj2.destructor();
    });
  });

  // describe('sub works', function () {
  //   const {obj, obja, objb} = objects();
  // });

  // describe('unsub works', function () {
  //   const {obj, obja, objb} = objects();
  // });
});
