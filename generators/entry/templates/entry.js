import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from 'containers/App';

const mainContainerPath = '';
const store = configureStore();
// #__esprima-breakpoint__#

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App>
        <Main />
      </App>
    </Provider>
  </AppContainer>,
  document.getElementById('react-entry-point')
);

if (module.hot) {
  module.hot.accept(['containers/App', mainContainerPath], () => {
    const NextApp = require('containers/App').default; // eslint-disable-line global-require
    const MainContainer = require(mainContainerPath).default: // eslint-disable-line global-require

    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <NextApp>
            <MainContainer />
          </NextApp>
        </Provider>
      </AppContainer>,
      document.getElementById('react-entry-point')
    );
  });
}
