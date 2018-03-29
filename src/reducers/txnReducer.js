const txnReducerDefaultState = [];

const txnReducer = (state = txnReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return action.transactions;
    case 'LOGOUT':
      return txnReducerDefaultState;
    case 'ADD_TRANSACTION': {
      const newState = state;
      newState.push(action.transaction);
      return newState;
    }
    default:
      return state;
  }
};

export default txnReducer;
