import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'containers/App';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App>
      <Main />
    </App>
  </Provider>,
  document.getElementById('react-entry-point')
);