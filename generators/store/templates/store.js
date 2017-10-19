import { createStore, applyMiddleware, compose  } from 'redux';

const mainReducerPath = '';
const middleware = [
  window.devToolsExtension && window.devToolsExtension(),
];

function reduxStore(initialState) {
  const store = createStore(mainReducer, initialState,
    middleware.length === 1 ? middleware[0] : compose(...middleware)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(mainReducerPath, () => {
      // We need to require for hot reloading to work properly.
      const nextReducer = require(mainReducerPath);  // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default reduxStore;
