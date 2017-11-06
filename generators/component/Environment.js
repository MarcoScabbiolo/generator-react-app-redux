const path = require('path');

class DummyBaseClass {}

module.exports = (BaseClass = DummyBaseClass) =>
  class extends BaseClass {
    get _componentToCreatePath() {
      return this._componentsPath();
    }
    get _componentToCreateFilePath() {
      return path.join('src', this._componentToCreatePath) + '.js';
    }
  };
