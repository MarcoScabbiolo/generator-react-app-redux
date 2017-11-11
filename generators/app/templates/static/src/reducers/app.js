import * as app from 'actions/app';

const initialState = {
  initialized: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case app.INITALIZE:
      return { ...state, initialized: true };
    default:
      return state;
  }
}

export default reducer;
