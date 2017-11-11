const loadingState = {
  loading: true,
  error: undefined
};

const notLoadingState = {
  loading: false,
  error: undefined
};

function errorState (error) {
  return {
    loading: false,
    error
  };
}

const loadingActions = [];
const notLoadingActions = [];
const errorActions = [];

const initialState = {
  ...notLoadingState
};

const reducer = (state = initialState, action) => {
  if (loadingActions.includes(action.type)) {
    state = { ...state, ...loadingState };
  } else if (notLoadingActions.includes(action.type)) {
    state = { ...state, ...notLoadingState };
  } else if (errorActions.includes(action.type)) {
    state = { ...state, ...errorState(action.error) };
  }

  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;