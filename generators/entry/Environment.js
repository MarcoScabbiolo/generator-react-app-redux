class DummyBaseClass {}

module.exports = (BaseClass = DummyBaseClass) =>
  class extends BaseClass {
    get _htmlEntryFilePath() {
      return this.props.skipEntryDirectory ? 'index.ejs' : this._resolvePath('index.ejs');
    }
  };
