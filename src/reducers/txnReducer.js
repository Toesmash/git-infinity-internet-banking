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
    case 'EDIT_TRANSACTION': {
      const editState = state.filter((item) => {
        return action.id !== item.txnID;
      });
      editState.push({
        txnID: action.id,
        ...action.payment
      });
      return editState;
    }

    case 'CANCELL_TRANSACTION': {
      return state.filter((txn) => {
        return action.id !== txn.txnID;
      });
    }
    default:
      return state;
  }
};

export default txnReducer;
