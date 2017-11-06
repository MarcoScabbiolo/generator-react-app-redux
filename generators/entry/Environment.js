class DummyBaseClass {}

module.exports = (BaseClass = DummyBaseClass) =>
  class extends BaseClass {
    get _htmlEntryFilePath() {
      return this.props.skipEntryDirectory ? 'index.ejs' : this._resolvePath('index.ejs');
    }
    get _relatedActions() {
      let actions = { app: 'app' };
      actions[this.props.name] = this._actionsPath;
      return actions;
    }
  };
