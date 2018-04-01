const accReducerDefaultState = [];

const accReducer = (state = accReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_ACCOUNTS':
      return action.accounts;
    case 'LOGOUT':
      return accReducerDefaultState;
    case 'UPDATE_BALANCE':
      return state.map((account) => {
        if (account.iban === action.iban) {
          return {
            ...account,
            ...action
          };
        }
        return account;
      });
    default:
      return state;
  }
};

export default accReducer;
