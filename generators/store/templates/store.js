import { createStore, applyMiddleware, compose  } from 'redux';

const middleware = [applyMiddleware(thunk)];

if (window.devToolsExtension) {
  middleware.push(window.devToolsExtension());
}

function reduxStore(initialState) {
  const store = createStore(mainReducer, initialState,
    middleware.length === 1 ? middleware[0] : compose(...middleware)
  );

  return store;
}

export default reduxStore;
