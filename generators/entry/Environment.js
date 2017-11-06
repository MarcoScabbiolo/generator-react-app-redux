class DummyBaseClass {}

module.exports = (BaseClass = DummyBaseClass) =>
  class extends BaseClass {
    get _htmlEntryFilePath() {
      return this.props.skipEntryDirectory ? 'index.ejs' : this._resolvePath() + '.ejs';
    }
    get _relatedActions() {
      let actions = { app: 'actions/app' };
      actions[this.props.name] = this._actionsPath;
      return actions;
    }
  };
