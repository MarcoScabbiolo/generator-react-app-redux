const path = require('path');

class DummyBaseClass {}

module.exports = (BaseClass = DummyBaseClass) =>
  class extends BaseClass {
    get _componentToCreatePath() {
      if (this.props.type === 'section') {
        return this._componentsPath('index');
      }
      return this._componentsPath();
    }
    get _componentToCreateFilePath() {
      return path.join('src', this._componentToCreatePath) + '.js';
    }
  };
