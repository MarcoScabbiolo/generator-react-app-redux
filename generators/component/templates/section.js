import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NewComponent extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOf([PropTypes.object, PropTypes.string])
  };
  render() {
    return (
      null
    );
  }
}

export default NewComponent;