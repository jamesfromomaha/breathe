import { message_passing } from './message_passing';

export function collection(cls) {
  const { pub, sub, unsub } = message_passing(cls);
  const { prototype } = cls;

  sub('custom-element', 'connect', function () { this._collection = [] });
  
  prototype.get_collection = function () { return this._collection };
  prototype.set_collection = function (items) {
    this._collection = items || [];
    pub('collection', 'replace');
  };
  prototype.update_collection = function (items) {
    // TODO actually update
    pub('collection', 'update');
  };

  return cls;
};
