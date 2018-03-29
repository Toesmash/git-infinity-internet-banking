const accReducerDefaultState = [];

const accReducer = (state = accReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return action.accounts;
    case 'LOGOUT':
      return accReducerDefaultState;
    default:
      return state;
  }
};

export default accReducer;
