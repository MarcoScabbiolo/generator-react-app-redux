import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './app.scss';

class App extends PureComponent {
  static propTypes = {
    initialized: PropTypes.bool.isRequired,
    children: PropTypes.element,
    onInitialize: PropTypes.func.isRequired
  };
  componentDidMount() {
    this.props.onInitialize();
  }
  render() {
    return (
      <div className="app">
        { this.props.initialized ? this.props.children : undefined }
      </div>
    );
  }
}

export default App;