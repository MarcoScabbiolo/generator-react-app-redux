import React, { Component } from 'react';

class App extends Component {
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